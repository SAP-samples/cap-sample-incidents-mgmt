using { sap.capire.incidents as my } from '../db/schema';

@protocol: [{ kind: 'odata', path: '/incidents' }]
service IncidentsService {
  @odata.draft.enabled
  entity Incidents as projection on my.Incidents;
}
