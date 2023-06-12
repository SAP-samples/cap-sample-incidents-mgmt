using { sap.capire.incidents as my } from '../db/schema';

/**
 * Used by Customers to create and browse their Incidents.
 */
service CustomersService {
  entity Incidents as projection on my.Incidents { *
  } excluding { modifiedBy } where customer.ID = $user;
}