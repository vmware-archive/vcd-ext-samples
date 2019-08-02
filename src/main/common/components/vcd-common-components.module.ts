import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {VcdSdkModule} from "@vcd/sdk";

import {LoadingIndicatorComponent} from "./loading-indicator.component";

@NgModule({
    imports: [
        CommonModule,
        VcdSdkModule
    ],

    declarations: [
        LoadingIndicatorComponent
    ],

    exports: [
        LoadingIndicatorComponent
    ]
})
export class VcdCommonComponentsModule {}
