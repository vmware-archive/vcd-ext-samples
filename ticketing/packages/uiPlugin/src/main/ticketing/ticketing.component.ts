import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Ticket} from "ticketing-types";
import {
    ActionItem, ActionType, DatagridComponent,
    DatagridStringFilter,
    GridColumn, GridDataFetchResult,
    GridSelectionType, GridState,
    PaginationConfiguration, SubscriptionTracker,
    WildCardPosition
} from "@vcd/ui-components";
import {DefinedEntity} from "../api/models/DefinedEntityModel";
import {TranslationService} from "@vcd/i18n";
import {TicketingService} from "./ticketing.service";
import {Pagination} from "../api/models/PaginationModel";
import {LinkRelType} from "@vcd/sdk";
import {TicketModalComponent} from "./ticket-modal/ticket-modal.component";
import {DeleteModalComponent} from "./delete-modal/delete-modal.component";

@Component({
    selector: "ticketing-plugin",
    templateUrl: "./ticketing.component.html",
    styleUrls: ['./ticketing.component.scss'],
    host: {'class': 'content-container'}
})
export class TicketingComponent implements OnInit, OnDestroy {
    private _subscriptions: SubscriptionTracker = new SubscriptionTracker(this);

    @ViewChild("ticketModal", {static: false}) private ticketModal: TicketModalComponent;
    @ViewChild("deleteModal", {static: false}) private deleteModal: DeleteModalComponent;
    @ViewChild("datagrid", {static: false}) private datagrid: DatagridComponent<any>;

    errorMessage: string;
    selectionType = GridSelectionType;
    selected: DefinedEntity<Ticket>[] = [];
    tickets: DefinedEntity<Ticket>[] = [];

    paginationInfo: PaginationConfiguration = {
        pageSize: 5,
        pageSizeOptions: [5, 10],
        shouldShowPageNumberInput: true,
        shouldShowPageSizeSelector: true,
    };

    columns: GridColumn<DefinedEntity<Ticket>>[] = null;

    constructor(private ticketingService: TicketingService,
                private translationService: TranslationService) {
    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {

        this._subscriptions.subscribe(this.translationService.translateAsync("ticketing.grid.id"), (a) => {
            this.initGridColumns();
        });
    }

    initGridColumns() {

        this.columns = [
            {
                displayName: this.translationService.translate("ticketing.grid.id"),
                renderer: (ticket) => ticket.id.split(":").pop(),
                queryFieldName: "id",
                filter: DatagridStringFilter(WildCardPosition.WRAP, ""),
            },
            {
                displayName: this.translationService.translate("ticketing.grid.type"),
                renderer: "entity.type",
                queryFieldName: "entity.type",
                filter: DatagridStringFilter(WildCardPosition.WRAP, ""),
            },
            {
                displayName: this.translationService.translate("ticketing.grid.description"),
                renderer: "entity.description",
                queryFieldName: "entity.description",
                filter: DatagridStringFilter(WildCardPosition.WRAP, ""),
            },
            {
                displayName: this.translationService.translate("ticketing.grid.status"),
                renderer: "entity.status",
                queryFieldName: "entity.status",
                filter: DatagridStringFilter(WildCardPosition.WRAP, ""),
            },
        ];
    }

    gridData: GridDataFetchResult<DefinedEntity<Ticket>> = {
        items: [],
    };

    private previousGridState: GridState<DefinedEntity<Ticket>>;

    async refresh(eventData: GridState<DefinedEntity<Ticket>>) {

        this.previousGridState = eventData;

        let sort: {
            field: string;
            reverse?: boolean;
        } = null;

        if (eventData.sortColumn) {
            sort = {
                field: eventData.sortColumn.name,
                reverse: eventData.sortColumn.reverse
            };
        }
        let tickets: Pagination<DefinedEntity<Ticket>>;
        try {
            tickets = await this.ticketingService.fetchTickets(
                eventData.pagination.itemsPerPage,
                eventData.pagination.pageNumber,
                sort,
                eventData.filters
            );
        } catch (e) {
            this.errorMessage = e.message || e.details || e;
        }

        this.tickets = tickets.values;

        this.gridData = {
            items: this.tickets,
            totalItems: tickets.resultTotal,
        };
    }

    public get actions(): ActionItem<DefinedEntity<Ticket>, any>[] {
        return [
            {
                textKey: "ticketing.action.new",
                handler: () => {
                    this.ticketModal.open();
                },
                availability: (selection) => {
                    return true;
                },
                class: "btn btn-sm btn-link",
                actionType: ActionType.STATIC_FEATURED
            },
            {
                textKey: "ticketing.action.delete",
                handler: (selection) => {

                    if (!selection) return;

                    const ticket = selection[0];

                    const deleteModalConfig = {
                        header: this.translationService.translate("ticketing.deleteModal.header",
                            [ticket.id]),
                        body: this.translationService.translate("ticketing.deleteModal.body",
                            [ticket.id]),
                        deleteHandler: this.onDeleteConfirm.bind(this),
                        payload: ticket
                    };

                    this.deleteModal.open(deleteModalConfig);
                },
                availability: (selection) => {
                    return this.ticketingService.canPerformAction(selection[0].navigable, LinkRelType.remove);
                },
                class: "btn btn-sm btn-link",
                actionType: ActionType.CONTEXTUAL_FEATURED
            },
            {
                textKey: "ticketing.action.edit",
                handler: (selection) => {

                    if (!selection) return;

                    const ticket = selection[0];

                    this.ticketModal.open(ticket);
                },
                availability: (selection) => {
                    return this.ticketingService.canPerformAction(selection[0].navigable, LinkRelType.remove);
                },
                class: "btn btn-sm btn-link",
                actionType: ActionType.CONTEXTUAL_FEATURED
            },
        ];
    }

    private async onCreateConfirm(ticket: Ticket) {
        this.datagrid.isLoading = true;
        try {
            await this.ticketingService.createTicket(ticket)
        } catch (e) {
            this.errorMessage = e.message || e.details || e;
        } finally {
            this.datagrid.isLoading = false;
        }
        await this.refresh(this.previousGridState);

    }

    private async onEditConfirm(definedEntity: DefinedEntity<Ticket>) {
        this.datagrid.isLoading = true;
        try {
            await this.ticketingService.updateTicket(definedEntity);
        } catch (e) {
            this.errorMessage = e.message || e.details || e;
        } finally {
            this.datagrid.isLoading = false;
        }
        await this.refresh(this.previousGridState);
    }

    private async onDeleteConfirm(definedEntity: DefinedEntity<Ticket>) {
        this.datagrid.isLoading = true;
        try {
            await this.ticketingService.removeTicket(definedEntity.navigable);
        } catch (e) {
            this.errorMessage = e.message || e.details || e;
        } finally {
            this.datagrid.isLoading = false;
        }
        await this.refresh(this.previousGridState);
    }
}
