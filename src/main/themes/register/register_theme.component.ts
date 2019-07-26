import {Component, ElementRef, EventEmitter, Output, ViewChild} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BrandingService} from "../../common/services/branding.service";
import {ErrorType} from "@vcd/bindings/vcloud/api/rest/schema_v1_5";
import {ThemeType} from "../themes-grid.component";

export enum ControlNames {
    Name = "name",
    CSS = "css"
}

@Component({
    selector: "vcd-ext-register-theme",
    templateUrl: "./register_theme.component.html",
    styleUrls: ["../common/theme.common.scss", "./register_theme.component.scss"]
})
export class RegisterThemeModalComponent {
    controlNames = ControlNames;
    errorMessage = "";
    isLoading = false;
    loadingMessageKey = "";
    opened = false;
    selectedFileName = "";
    registerThemeFormGroup = new FormGroup({
        [ControlNames.Name]: new FormControl("", Validators.required),
        [ControlNames.CSS]: new FormControl(null, Validators.required)
    });

    @Output() registered = new EventEmitter();

    @ViewChild("file") file: ElementRef;

    constructor(private brandingService: BrandingService) {}

    close() {
        this.errorMessage = "";
        this.opened = false;
    }

    open() {
        this.registerThemeFormGroup.reset();
        this.opened = true;
    }

    onFileChange(event: any) {
        if (event.target.files && event.target.files.length === 1) {
            this.selectedFileName = event.target.files[0].name;
            this.registerThemeFormGroup.get(ControlNames.CSS).setValue(event.target.files[0]);
        }
    }

    clearSelectedFile() {
        this.file.nativeElement.value = "";
        this.selectedFileName = "";
        this.registerThemeFormGroup.get(ControlNames.CSS).reset();
    }

    register() {
        this.isLoading = true;
        this.loadingMessageKey = "com.vmware.plugin-lifecycle.themes.register.loadingMessage";
        this.errorMessage = "";
        this.brandingService
            .registerTheme({
                name: this.registerThemeFormGroup.get(ControlNames.Name).value,
                themeType: ThemeType.CUSTOM
            }, this.registerThemeFormGroup.get(ControlNames.CSS).value)
            .subscribe(() => {
                this.isLoading = false;
                this.loadingMessageKey = "";
                this.close();
                this.registered.emit();
            }, (error: ErrorType) => {
                this.isLoading = false;
                this.loadingMessageKey = "";
                this.errorMessage = (error && error.message) || "Failed to execute the request";
            });
    }
}
