import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {ClarityModule} from "clarity-angular";

import {VcdSdkModule} from "@vcd/sdk";

import {VcdCommonServicesModule} from "../common/services/common.services.module";
import {ThemesComponent} from "./themes.component";
import {RegisterThemeModalComponent} from "./register/register_theme.component";
import {RemoveThemeModalComponent} from "./remove/remove_theme.component";
import {VcdCommonComponentsModule} from "../common/components/vcd-common-components.module";
import {PublishThemeComponent} from "./publish/publish_theme.component";
import {ThemesGridComponent} from "./themes-grid.component";



@NgModule({
    imports: [
        // Angular Modules
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        // Clarity Modules
        ClarityModule,

        // VCD Modules
        VcdSdkModule,

        VcdCommonServicesModule,
        VcdCommonComponentsModule
    ],

    declarations: [
        ThemesComponent,
        ThemesGridComponent,
        RegisterThemeModalComponent,
        RemoveThemeModalComponent,
        PublishThemeComponent
    ],

    entryComponents: [
        ThemesComponent
    ],

    exports: [],

    providers: []
})
export class ThemesModule {}
