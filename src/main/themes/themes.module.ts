import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {ClarityModule} from "clarity-angular";

import {VcdSdkModule} from "@vcd/sdk";

import {VcdExCommonServicesModule} from "../common/services/common.services.module";
import {ThemesComponent} from "./themes.component";
import {RegisterThemeModalComponent} from "./register/register_theme.component";
import {RenameThemeComponent} from "./rename/rename_theme.component";
import {RemoveThemeModalComponent} from "./remove/remove_theme.component";
import {CommonComponentsModule} from "../common/components/common.components.module";
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

        VcdExCommonServicesModule,
        CommonComponentsModule
    ],

    declarations: [
        ThemesComponent,
        ThemesGridComponent,
        RegisterThemeModalComponent,
        RenameThemeComponent,
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
