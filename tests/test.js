const cds = require('@sap/cds/lib');
const { default: axios } = require('axios');
const { GET, POST, DELETE, expect } = cds.test(__dirname + '../../');

axios.defaults.auth = { username: "incident.support@tester.sap.com", password: "initial" }

jest.setTimeout(11111)

describe('Test The GET Endpoints', () => {
  it('Should check Processors Service', async () => {
    const processorsService = await cds.connect.to('ProcessorsService');
    const { Incidents } = processorsService.entities;
    expect(await SELECT.from(Incidents)).to.have.length(4);
  });

  it('Should check Customers', async () => {
    const processorsService = await cds.connect.to('ProcessorsService');
    const { Customers } = processorsService.entities;
    expect(await SELECT.from(Customers)).to.have.length(3);
  });

  it('Test Expand Entity Endpoint', async () => {
    const { data } = await GET`/odata/v4/processors/Customers?$select=firstName&$expand=incidents`;
    expect(data).to.be.an('object');
  });
});

describe('Draft Choreography APIs', () => {
  let draftId;

  it('Create an incident', async () => {
    const { status, statusText, data } = await POST(`/odata/v4/processors/Incidents`, {
      title: 'Urgent attention required !',
      status_code: 'N',
    });
    draftId = data.ID;
    expect(status).to.equal(201);
    expect(statusText).to.equal('Created');
  });

  it('+ Activate the draft', async () => {
    const response = await POST(
      `/odata/v4/processors/Incidents(ID=${draftId},IsActiveEntity=false)/ProcessorsService.draftActivate`
    );
    expect(response.status).to.eql(201);
  });

  it('+ Test the incident status', async () => {
    const { status, data: { status_code } } = await GET(`/odata/v4/processors/Incidents(ID=${draftId},IsActiveEntity=true)`);
    expect(status).to.eql(200);
    expect(status_code).to.eql('N');
  });

  it('- Delete the Incident', async () => {
    const response = await DELETE(`/odata/v4/processors/Incidents(ID=${draftId},IsActiveEntity=true)`);
    expect(response.status).to.eql(204);
  });
});