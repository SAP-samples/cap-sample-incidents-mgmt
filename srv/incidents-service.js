const cds = require('@sap/cds')

class IncidentsService extends cds.ApplicationService {
  /** Registering custom event handlers */

  async init() {
    this.before('UPDATE', 'Incidents', req => this.onUpdate(req))
    this.after('READ', 'Incidents', data => this.changeUrgencyDueToSubject(data))


    // added further handlers
    this.on('READ', 'Customers', (req) => this.onCustomerRead(req));
    this.S4bupa = await cds.connect.to('API_BUSINESS_PARTNER');

    this.db = await cds.connect.to('db')                                 // our primary database
    this.Customers = this.db.entities('s4.simple').Customers             // CDS definition of the Customers entity
    this.Incidents = this.db.entities('sap.capire.incidents').Incidents  // CDS definition of the Incidents entity
    this.on(['CREATE', 'UPDATE', 'DELETE'], 'Incidents', (req, next) => this.onCustomerCache(req, next))

    this.S4bupa.on('BusinessPartner.Changed', ({ event, data }) => this.onBusinessPartnerChanged(event, data))
    return super.init()
  }

  changeUrgencyDueToSubject(data) {
    if (data) {
      const incidents = Array.isArray(data) ? data : [data]
      incidents.forEach(incident => {
        if (incident.title?.toLowerCase().includes('urgent')) {
          incident.urgency = { code: 'H', descr: 'high' }
        }
      })
    }
  }

  /** Custom Validation */
  async onUpdate(req) {
    const { status_code } = await SELECT.one(req.subject, i => i.status_code).where({ ID: req.data.ID })
    if (status_code === 'C') return req.reject(`Can't modify a closed incident`)
  }

  async onCustomerRead(req) {
    console.log('>> delegating to S4 service...');
    return this.S4bupa.run(req.query);
  }

  async onCustomerCache(req, next){
    /*
      Cleanup Cache:
      - Delete old customer ID from Cache, if changed by update or if deleted
        Only if no other incident exists
      - Insert/Update new customer ID into Cache, if changed by update or if inserted
    */    
    const newCustomerId = req.data.customer_ID
    let oldCustomerId;
    if (req.event!=="CREATE") {
      const incident = await SELECT.from(this.Incidents, req.data.ID)
      //Remember Customer ID
      oldCustomerId = incident?.customer_ID
    }
    
    const result = await next();
    
    if ( (oldCustomerId && (oldCustomerId!=="")) && ((req.event=="DELETE") || ((req.event=="UPDATE") && (oldCustomerId!==newCustomerId))) ) {
      console.log('>> DELETING customer if no more used - Incident ID: ' + req.data.ID)
      const customerIncident = await SELECT.one.from(this.Incidents).where({ customer_ID: oldCustomerId, ID:{'!=':req.data.ID} })
      if (!customerIncident) {
        //No more incidents for that Customer => delete cached record
        await DELETE.from(this.Customers).where({ ID: oldCustomerId })
      }
    }
    
    if (newCustomerId && (newCustomerId!=="") && ((req.event=="CREATE") || (req.event=="UPDATE")) ) {
      console.log('>> CREATE or UPDATE customer!')
      const customer = await this.S4bupa.read(this.Customers, newCustomerId)
      if (customer) {
        await UPSERT.into(this.Customers).entries(customer)
      }
    }
    
    return result;
  }


  async onBusinessPartnerChanged(event, data){
    console.log('<< received', event, data)
    const { BusinessPartner: ID } = data
    const customer = await this.S4bupa.read (this.Customers, ID)
    let exists = await this.db.exists (this.Customers,ID)
    if (exists)
      await UPDATE (this.Customers, ID) .with (customer)
    else
      await INSERT.into (this.Customers) .entries (customer)
  }
}

module.exports = IncidentsService
