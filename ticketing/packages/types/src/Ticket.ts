/**
 * A definition of a ticket entity.
 * @definedEntityType
 */
export class Ticket {
    type: TicketType;
    description: string;
    status: TicketStatus;
}

export const enum TicketType{
    SoftwareIssue = "SoftwareIssue",
    HardwareIssue = "HardwareIssue"
}

export const enum TicketStatus{
    Open = "Open",
    Closed = "Closed"
}