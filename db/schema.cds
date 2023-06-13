using { cuid, managed, sap.common.CodeList } from '@sap/cds/common';
namespace sap.capire.incidents;

/**
 * Incidents created by Customers.
 */
entity Incidents : cuid, managed {
   title        : String  @title : 'Title';
   urgency      : Association to Urgency;
   status       : Association to Status;
   conversations: Composition of many Conversations on conversations.incidents = $self;
}

entity Status : CodeList {
    key code: String enum {
        new = 'N';
        assigned = 'A';
        in_process = 'I';
        on_hold = 'H';
        resolved = 'R';
        closed = 'C';
};
    criticality : Integer; 
}

entity Urgency : CodeList {
    key code: String enum {
        high = 'H';
        medium = 'M';
        low = 'L';
};
}

 entity Conversations : cuid, managed {
         incidents : Association to Incidents;
         timestamp : DateTime;
         author    : String @cds.on.insert: $user;
         message   : String;
   }

type EMailAddress : String;
type PhoneNumber : String;
type City : String;
