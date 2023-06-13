using { sap.capire.incidents, IncidentsService } from './incidents-service';
using { s4 } from './external';

extend service IncidentsService with {
  entity Customers as projection on s4.simple.Customers;
}

extend incidents.Incidents with {
  customer : Association to s4.simple.Customers;
}


// import annotations from rest of the application
using from '../app/services';

annotate IncidentsService.Incidents with @(
  UI: {
    // insert table column
    LineItem : [
      ...up to { Value: title },
      { Value: customer.name, Label: 'Customer' },
      ...
    ],
  }
);

// for an incident's customer, show both name and ID
annotate IncidentsService.Incidents:customer with @Common: {
  Text: customer.name,
  TextArrangement: #TextFirst
};