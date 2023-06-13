using { sap.capire.incidents as my } from '../db/schema';

/**
 * Used by Customers to create and browse their Incidents.
 */
//rok: raus
/*
service CustomersService {
  entity Incidents as projection on my.Incidents { *
  //rok: Warum dieses Excluding?
  } //rok: raus - excluding { modifiedBy } where  customer.ID = $user;
}
*/