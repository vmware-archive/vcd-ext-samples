import {Component, ElementRef, EventEmitter, HostListener, Output, ViewChild} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";

import {ErrorType} from "@vcd/bindings/vcloud/api/rest/schema_v1_5";
import {UiTheme} from "@vcd/bindings/vcloud/rest/openapi/model";

import {ObjectHelper} from "../../common/utils";
import {BrandingService} from "../../common/services/branding.service";


enum ControlNames {
    Name = "name"
}



@Component({
    selector: "vcd-ext-rename-theme",
    templateUrl: "./rename_theme.component.html",
    styleUrls: ["../common/theme.common.scss"]
})
export class RenameThemeComponent {
    controlNames = ControlNames;
    errorMessage = "";
    isLoading = false;
    loadingMessageKey = "";
    opened = false;
    uiTheme: UiTheme;

    @Output() renamed = new EventEmitter();

    @ViewChild("renameInput") renameInput: ElementRef;

    constructor(private brandingService: BrandingService) {}

    renameFormGroup = new FormGroup({
        [ControlNames.Name]: new FormControl("", Validators.required)
    });

    close() {
        this.errorMessage = "";
        this.uiTheme = null;
        this.opened = false;
    }

    open(uiTheme: UiTheme) {
        this.errorMessage = "";
        this.uiTheme = ObjectHelper.clone(uiTheme);
        this.renameFormGroup.reset({
            [ControlNames.Name]: this.uiTheme.name
        });
        this.opened = true;
        window.setTimeout(() => {
            this.renameInput.nativeElement.focus();
        }, 0);
    }

    onOK() {
        this.isLoading = true;
        this.loadingMessageKey = "com.vmware.plugin-lifecycle.themes.rename.loadingMessage";
        this.brandingService.renameTheme(this.uiTheme.name, {
            ...this.uiTheme,
            name: this.renameFormGroup.get(ControlNames.Name).value
        })
            .subscribe(() => {
                this.isLoading = false;
                this.loadingMessageKey = "";
                this.close();
                this.renamed.emit();
            }, (error: ErrorType) => {
                this.isLoading = false;
                this.loadingMessageKey = "";
                this.errorMessage = (error && error.message) || "Failed to execute the request";
            });
    }
}
