import {Injectable} from "@angular/core";
import {ApiClientService} from "../api/api-client.service";
import {Ticket} from "ticketing-types";
import {LinkType, TaskType} from "@vcd/bindings/vcloud/api/rest/schema_v1_5";
import {Navigable} from "@vcd/sdk";
import {DefinedEntity} from "../api/models/DefinedEntityModel";
import {LinkRelType} from "@vcd/angular-client/client/vcd.api.client";

@Injectable()
export class TicketingService {

    constructor(private client: ApiClientService) {
    }

    /**
     * Creates a new ticket
     * @param ticket
     */
    public async createTicket(ticket: Ticket) {

        const task: TaskType = await this.client.createTicket(ticket);
        await this.client.resolveTicket(task.owner.id);
        return task.owner.id;
    }

    /**
     * Removes an existing ticket
     * @param ticket
     */
    public async removeTicket(ticket: Navigable) {
        await this.client.removeTicket(ticket);
    }

    /**
     * Fetches all tickets
     */
    public async fetchTickets(
        pageSize: number,
        page: number,
        sort: {
            field: string;
            reverse?: boolean;
        },
        customFilters: string[]
    ) {
        const tickets = await this.client.getTickets(pageSize, page, sort, customFilters);

        tickets.values.forEach((defEntityTicket: DefinedEntity<Ticket>) => {
            this.mapDefinedEntityLinksToNavigable(defEntityTicket, tickets.link);
        });

        return tickets;
    }

    /**
     * Updates a ticket
     */
    public async updateTicket(definedEntity: DefinedEntity<Ticket>) {
        delete definedEntity.link;
        delete definedEntity.navigable;

        await this.client.updateTicket(definedEntity);
    }

    canPerformAction(item: Navigable, linkRelType: LinkRelType | string, entityRefType?: string) {
        return this.client.canPerformAction(item, linkRelType, entityRefType);
    }

    private mapDefinedEntityLinksToNavigable(defEntity: DefinedEntity<Ticket>, link: LinkType[]): DefinedEntity<Ticket> {
        defEntity.navigable =
            {
                link: [
                    ...link.filter((l) => l.id === defEntity.id)
                ]
            };
        return defEntity;
    }
}