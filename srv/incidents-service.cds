using { sap.capire.incidents as my } from '../db/schema';

service IncidentsService {
  @odata.draft.enabled
  entity Incidents as projection on my.Incidents;
}
