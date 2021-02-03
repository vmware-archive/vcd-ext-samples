import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Ticket, TicketStatus, TicketType} from "ticketing-types";
import {DefinedEntity} from "../../api/models/DefinedEntityModel";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SelectOption} from "@vcd/ui-components";
import {TranslationService} from "@vcd/i18n";

const TICKET_FORM_NAMES = {
    TYPE: "type",
    DESCRIPTION: "description",
    STATUS: "status"
};

@Component({
    selector: 'ticket-modal',
    templateUrl: './ticket-modal.component.html',
    styleUrls: ['./ticket-modal.component.scss']
})
export class TicketModalComponent implements OnInit {

    opened = false;
    editTicket: DefinedEntity<Ticket>;
    ticketForm: FormGroup;
    ticketFormNames = TICKET_FORM_NAMES;
    @Output()
    ticketSubmitted = new EventEmitter<Ticket>();
    @Output()
    ticketEdited = new EventEmitter<DefinedEntity<Ticket>>();

    typeOptions: SelectOption[] = [
        {
            display: this.translationService.translate("ticketing.modal.input.type.option.hardwareIssue"),
            value: TicketType.HardwareIssue
        },
        {
            display: this.translationService.translate("ticketing.modal.input.type.option.softwareIssue"),
            value: TicketType.SoftwareIssue
        },
    ];

    statusOptions: SelectOption[] = [
        {
            display: this.translationService.translate("ticketing.modal.input.status.option.open"),
            value: TicketStatus.Open,
        },
        {
            display: this.translationService.translate("ticketing.modal.input.status.option.closed"),
            value: TicketStatus.Closed,
        }
    ];

    constructor(private formBuilder: FormBuilder,
                private translationService: TranslationService) {
    }

    open(editTicket?: DefinedEntity<Ticket>){
        this.editTicket = editTicket;
        this.opened = true;
        if(editTicket){
            this.ticketForm.get(TICKET_FORM_NAMES.TYPE).setValue(editTicket.entity.type);
            this.ticketForm.get(TICKET_FORM_NAMES.DESCRIPTION).setValue(editTicket.entity.description);
            this.ticketForm.get(TICKET_FORM_NAMES.STATUS).setValue(editTicket.entity.status);
        }else{
            this.ticketForm.get(TICKET_FORM_NAMES.TYPE).setValue(TicketType.SoftwareIssue);
            this.ticketForm.get(TICKET_FORM_NAMES.DESCRIPTION).setValue("");
            this.ticketForm.get(TICKET_FORM_NAMES.STATUS).setValue(TicketStatus.Open);
        }
    }

    close() {
        this.opened = false;
        this.ticketForm.reset();
    }

    ngOnInit(): void {
        this.ticketForm = this.formBuilder.group({
            [TICKET_FORM_NAMES.TYPE]: ["", Validators.required],
            [TICKET_FORM_NAMES.DESCRIPTION]: ["", Validators.required],
            [TICKET_FORM_NAMES.STATUS]: ["", Validators.required]
        });
    }

    submit(){

        if (this.ticketForm.invalid) return;

        const type = this.ticketForm.get(TICKET_FORM_NAMES.TYPE).value;
        const description = this.ticketForm.get(TICKET_FORM_NAMES.DESCRIPTION).value;
        const status = this.ticketForm.get(TICKET_FORM_NAMES.STATUS).value;

        if(this.editTicket){

            this.editTicket.entity.status = status;
            this.editTicket.entity.description = description;
            this.editTicket.entity.type = type;

            this.ticketEdited.emit(this.editTicket);
        } else{
            this.ticketSubmitted.emit({
                type,
                description,
                status
            });
        }

        this.close();
    }
}
