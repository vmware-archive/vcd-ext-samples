import {Component, ElementRef, EventEmitter, Output, ViewChild} from "@angular/core";

import {ErrorType} from "@vcd/bindings/vcloud/api/rest/schema_v1_5";

import {BrandingService} from "../../common/services/branding.service";



@Component({
    selector: "vcd-ext-remove-theme",
    templateUrl: "./remove_theme.component.html"
})
export class RemoveThemeModalComponent {
    errorMessage = "";
    isLoading = false;
    loadingMessageKey = "";
    opened = false;
    themeName = "";

    @Output() removed = new EventEmitter();

    @ViewChild("deleteBtn") deleteBtn: ElementRef;

    constructor(private brandingService: BrandingService) {}

    close() {
        this.errorMessage = "";
        this.themeName = "";
        this.opened = false;
    }

    open(themeName: string) {
        this.errorMessage = "";
        this.themeName = themeName;
        this.opened = true;
        window.setTimeout(() => {
            this.deleteBtn.nativeElement.focus();
        }, 0);
    }

    delete() {
        this.isLoading = true;
        this.loadingMessageKey = "com.vmware.plugin-lifecycle.themes.delete.loadingMessage";
        this.brandingService.removeTheme(this.themeName)
            .subscribe(() => {
                this.isLoading = false;
                this.loadingMessageKey = "";
                this.close();
                this.removed.emit();
            }, (error: ErrorType) => {
                this.isLoading = false;
                this.loadingMessageKey = "";
                this.errorMessage = (error && error.message) || "Failed to execute the request";
            });
    }
}
