using { API_BUSINESS_PARTNER as S4 } from './API_BUSINESS_PARTNER';

namespace s4.simple;

entity Customers as projection on S4.A_BusinessPartner {
  key BusinessPartner as ID,
  BusinessPartnerFullName as name
}

annotate Customers with @UI.Identification : [{ Value:name }];
annotate Customers with @cds.odata.valuelist;
annotate Customers with {
  ID   @title : 'Customer ID';
  name @title : 'Customer Name';
}