const cds = require('@sap/cds')

class IncidentsService extends cds.ApplicationService {
 /** Registering custom event handlers */
 
 //rok: async hinzugefügt
 async init() {
   this.before("UPDATE", "Incidents", (req) => this.onUpdate(req));
   this.after("READ", "Incidents", (data) => this.changeUrgencyDueToSubject(data));
   
   //rok: neu
   this.on('READ', 'Customers', (req) => this.onCustomerRead(req));
   this.S4bupa = await cds.connect.to('API_BUSINESS_PARTNER')

    return super.init();
  }

  changeUrgencyDueToSubject(data) {
    if (data) {
      const incidents = Array.isArray(data) ? data : [data];
      incidents.forEach((incident) => {
        if (incident.title?.toLowerCase().includes("urgent")) {
          incident.urgency = { code: "H", descr: "high" };
        }
      });
    }
  }

  /** Custom Validation */
  async onUpdate (req) {
    const { status_code } = await SELECT.one(req.subject, i => i.status_code).where({ID: req.data.ID})
    if (status_code === 'C')
      return req.reject(`Can't modify a closed incident`)
  }

  //rok: neu komplette methode
  async onCustomerRead(req){
    console.log('>> delegating to S4 service...')
    return this.S4bupa.run(req.query)
  }

}
module.exports = IncidentsService