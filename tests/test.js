const cds = require('@sap/cds/lib');
const { GET, POST, DELETE, expect } = cds.test(__dirname+'../../');

jest.setTimeout(11111)

describe('Test The GET Endpoints', () => {
    it('Should check Incident Service', async () => {
      const incidentService = await cds.connect.to('IncidentsService');
      const { Incidents } = incidentService.entities;
      expect(await SELECT.from(Incidents)).to.have.length(4);
    });

    it('Should check Customers Service', async () => {
      const incidentService = await cds.connect.to('IncidentsService');
      const { Customers } = incidentService.entities;
      expect(await SELECT.from(Customers)).to.have.length(3);
    });

    it('Test Expand Entity Endpoint', async () => {
      const { data } = await GET`/odata/v4/incidents/Customers?$select=firstName&$expand=incidents`;
      expect(data).to.be.an('object');
    });
  });

  describe('Draft Choreography APIs', () => {
    let draftId;

    it('Create an incident', async () => {
      const { status, statusText, data } = await POST(`/odata/v4/incidents/Incidents`, {
        title: 'test3',
        urgency_code: 'H',
        status_code: 'A',
      });
      draftId = data.ID;
      expect(status).to.equal(201);
      expect(statusText).to.equal('Created');
    });

    it('+ Activate the draft', async () => {
      const response = await POST(
        `/odata/v4/incidents/Incidents(ID=${draftId},IsActiveEntity=false)/IncidentsService.draftActivate`
      );
      expect(response.status).to.eql(201);
    });

    it('+ Test the verification status', async () => {
      const response = await GET(`/odata/v4/incidents/Incidents(ID=${draftId},IsActiveEntity=true)`);
      expect(response.status).to.eql(200);
    });

    it('- Delete the Incident', async () => {
      const response = await DELETE(`/odata/v4/incidents/Incidents(ID=${draftId},IsActiveEntity=true)`);
      expect(response.status).to.eql(204);
    });
  });
