import {CommonModule} from "@angular/common";
import {Inject, NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {Store} from "@ngrx/store";
import {VcdSdkModule} from "@vcd/sdk";
import {EXTENSION_ROUTE, ExtensionNavRegistration} from "@vcd/sdk/common";
import {PluginModule} from "@vcd/sdk/core";
import {TranslateService} from "@vcd/sdk/i18n";
import {ClarityModule} from "clarity-angular";
import {PluginsComponent} from "./plugins/plugins.component";
import {PluginsModule} from "./plugins/plugins.module";
import {SubnavComponent} from "./subnav.component";
import {ThemesModule} from "./themes/themes.module";
import {ThemesComponent} from "./themes/themes.component";

const ROUTES: Routes = [
    {
        path: "",
        component: SubnavComponent,
        children: [
            {path: "", redirectTo: "plugins", pathMatch: "full"},
            {path: "plugins", component: PluginsComponent},
            {path: "themes", component: ThemesComponent}
        ]
    }
];

@NgModule({
    imports: [
        ClarityModule,
        CommonModule,
        PluginsModule,
        VcdSdkModule,
        RouterModule.forChild(ROUTES),
        ThemesModule,
    ],
    declarations: [
        SubnavComponent
    ],
    entryComponents: [
        SubnavComponent
    ],
    exports: [],
    providers: []
})
export class ExtensionModule extends PluginModule {
    constructor(appStore: Store<any>, @Inject(EXTENSION_ROUTE) extensionRoute: string, translate: TranslateService) {
        super(appStore, translate);
        this.registerExtension(<ExtensionNavRegistration>{
            path: extensionRoute,
            icon: "page",
            nameCode: "com.vmware.plugin-lifecycle.nav.label",
            descriptionCode: "com.vmware.plugin-lifecycle.nav.description"
        });
    }
}
