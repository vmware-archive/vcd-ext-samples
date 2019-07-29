import {Component} from "@angular/core";

@Component({
    selector: "vcd-ext-subnav",
    templateUrl: "./subnav.component.html",
    host: {"class": "content-container"}
})
export class SubnavComponent {
    navItems = [
        {
            routerLink: "./plugins",
            iconShape: "cog",
            labelKey: "com.vmware.plugin-lifecycle.subnav.plugins.label",
            descriptionKey: "com.vmware.plugin-lifecycle.subnav.plugins.description"
        }
    ];
}
