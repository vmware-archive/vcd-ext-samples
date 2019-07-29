import {CommonModule} from "@angular/common";
import {Inject, NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Routes, RouterModule} from "@angular/router";
import {Store} from "@ngrx/store";
import {VcdSdkModule} from "@vcd/sdk";
import {EXTENSION_ROUTE, ExtensionNavRegistration} from "@vcd/sdk/common";
import {PluginModule} from "@vcd/sdk/core";
import {TranslateService} from "@vcd/sdk/i18n";
import {ClarityModule} from "clarity-angular";
import {PluginBundleService} from "./plugin-bundle.service";
import {PluginOperationsService} from "./plugin-operations.service";
import {PluginService} from "./plugin.service";
import {PluginsComponent} from "./plugins.component";
import {PublishFormComponent} from "./publish-form.component";
import {PublishModalComponent} from "./publish-modal.component";
import {UploadWizardComponent} from "./upload-wizard.component";

@NgModule({
    imports: [
        VcdSdkModule,
        ClarityModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        PluginsComponent,
        PublishFormComponent,
        PublishModalComponent,
        UploadWizardComponent
    ],
    entryComponents: [
        PluginsComponent
    ],
    exports: [],
    providers: [
        PluginService,
        PluginBundleService,
        PluginOperationsService
    ]
})
export class PluginsModule {
}
