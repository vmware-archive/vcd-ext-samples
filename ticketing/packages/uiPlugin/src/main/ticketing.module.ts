import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {VcdApiClient, VcdSdkModule} from "@vcd/sdk";
import {EXTENSION_ASSET_URL} from "@vcd/sdk";
import {I18nModule, TranslationService} from "@vcd/i18n";
import {ClarityModule} from "@clr/angular";
import {TicketingComponent} from "./ticketing/ticketing.component";
import {TicketModalComponent} from './ticketing/ticket-modal/ticket-modal.component';
import {ApiClientService} from "./api/api-client.service";
import {TicketingService} from "./ticketing/ticketing.service";
import {VcdComponentsModule} from "@vcd/ui-components";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DeleteModalComponent} from "./ticketing/delete-modal/delete-modal.component";

const ROUTES: Routes = [
    {path: "", component: TicketingComponent}
];

@NgModule({
    imports: [
        ClarityModule,
        CommonModule,
        VcdSdkModule,
        VcdComponentsModule,
        I18nModule.forChild(EXTENSION_ASSET_URL, false),
        RouterModule.forChild(ROUTES),
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        TicketingComponent,
        TicketModalComponent,
        DeleteModalComponent
    ],
    bootstrap: [TicketingComponent],
    exports: [],
    providers: [
        VcdApiClient,
        ApiClientService,
        TicketingService
    ]
})
export class TicketingPluginModule {
    constructor( translationService: TranslationService) {
        translationService.registerTranslations();
    }
}
