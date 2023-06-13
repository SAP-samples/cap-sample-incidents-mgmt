using { sap.capire.incidents as my } from '../db/schema';

service IncidentsService {
  @odata.draft.enabled
  entity Incidents as projection on my.Incidents;
  //rok - raus
  /*
  
  entity Customers as projection on my.Customers {
    *,
    firstName || ' ' || lastName as name: String
  };
  */

}
