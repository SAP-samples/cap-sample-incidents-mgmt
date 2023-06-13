//rok: sap.capire statt acme
using { sap.capire.incidents, IncidentsService } from './incidents-service';
using { s4 } from './external';

extend service IncidentsService with {
  entity Customers as projection on s4.simple.Customers;
}

//rok: incidents statt incmgt
extend incidents.Incidents with {
  customer : Association to s4.simple.Customers;
}


// import annotations from rest of the application
//rok: ersetzen - using from '../app/fiori';
using from '../app/services';

annotate IncidentsService.Incidents with @(
  UI: {
    // insert table column
    LineItem : [
      ...up to { Value: title },
      { Value: customer.name, Label: 'Customer' },
      ...
    ],

    // insert customer to field group
    FieldGroup #GeneralInformation : {
      Data: [
        { Value: customer_ID, Label: 'Customer'},
        //rok: ruas - ...
      ]
    },
  }
);

// for an incident's customer, show both name and ID
annotate IncidentsService.Incidents:customer with @Common: {
  Text: customer.name,
  TextArrangement: #TextFirst
};