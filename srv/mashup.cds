using { sap.capire.incidents, IncidentsService } from './incidents-service';
using { s4 } from './external';
using from '../app/services';

extend service IncidentsService with {
  entity Customers as projection on s4.simple.Customers;
}


extend incidents.Incidents with {
  customer : Association to s4.simple.Customers;
}


annotate IncidentsService.Incidents with @(
  UI: {
    // insert table column
    LineItem : [
      ...up to { Value: title },
      { Value: customer_ID, Label: 'Customer' },
      ...
    ],

    // insert customer to field group
    FieldGroup #Details : {
      Data: [
        { Value: customer_ID, Label: 'Customer'},
        ...
      ]
    },
  }
);

annotate s4.simple.Customers with @cds.persistence: { table,skip:false };
// for an incident's customer, show both name and ID
annotate IncidentsService.Incidents:customer with @Common: {
    Text: customer.name,
    TextArrangement: #TextFirst
};