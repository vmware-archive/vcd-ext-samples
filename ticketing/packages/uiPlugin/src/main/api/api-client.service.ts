import {Injectable} from "@angular/core";
import {TaskType} from "@vcd/bindings/vcloud/api/rest/schema_v1_5";
import {VcdApiClient} from "@vcd/sdk";
import {Navigable} from "@vcd/sdk";
import {DefinedEntity} from "./models/DefinedEntityModel";
import {Pagination} from "./models/PaginationModel";
import {Ticket} from "ticketing-types";
import {LinkRelType} from "@vcd/angular-client/client/vcd.api.client";
export const CLOUD_API = "cloudapi";
export const CLOUD_API_VERSION = "1.0.0";
export const CLOUD_API_ENDPOINT = `${CLOUD_API}/${CLOUD_API_VERSION}/`;
export const TICKET_TYPE_VERSION = "0.0.1";
export const TICKET_TYPE_ID = `urn:vcloud:type:vmware:ticket:${TICKET_TYPE_VERSION}`;

@Injectable()
export class ApiClientService {

    constructor(private client: VcdApiClient) {
    }

    public createTicket(ticket: Ticket): Promise<TaskType> {
        return this.client.createAsync(
            CLOUD_API_ENDPOINT + `entityTypes/${TICKET_TYPE_ID}`,
            {
                name : ticket.type,
                entity: ticket
            } as DefinedEntity<Ticket>
        ).toPromise();
    }

    public resolveTicket(ticketId: string){
        return this.client.createSync(
            CLOUD_API_ENDPOINT + `entities/${ticketId}/resolve`,
            null
        ).toPromise();
    }

    public removeTicket(ticket: Navigable): Promise<TaskType> {
        return this.client.removeItem(
            ticket
        ).toPromise();
    }

    public getTicket(ticketId: string): Promise<DefinedEntity<Ticket>> {
        return this.client.get(CLOUD_API_ENDPOINT + `entities/${ticketId}`)
            .toPromise() as Promise<DefinedEntity<Ticket>>;
    }

    public updateTicket(definedEntity: DefinedEntity<Ticket>): Promise<DefinedEntity<Ticket>> {
        return this.client.updateSync(CLOUD_API_ENDPOINT + `entities/${definedEntity.id}`, definedEntity)
            .toPromise() as Promise<DefinedEntity<Ticket>>;
    }

    public getTickets(pageSize: number,
                      page: number,
                      sort: {
                          field: string;
                          reverse?: boolean;
                      },
                      customFilters: string[]):
        Promise<Pagination<DefinedEntity<Ticket>>> {

            return this.client.get(
            CLOUD_API_ENDPOINT +
                // tslint:disable-next-line:max-line-length
                `entities/types/vmware/ticket/${TICKET_TYPE_VERSION}?pageSize=${pageSize}&page=${page}`)
            .toPromise() as Promise<Pagination<DefinedEntity<Ticket>>>;
    }

    canPerformAction(item: Navigable, linkRelType: LinkRelType | string, entityRefType?: string){
        return this.client.canPerformAction(item, linkRelType, entityRefType);
    }
}