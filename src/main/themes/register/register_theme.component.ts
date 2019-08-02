import {Component, ElementRef, EventEmitter, Output, ViewChild} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BrandingService} from "../../common/services/branding.service";
import {ErrorType} from "@vcd/bindings/vcloud/api/rest/schema_v1_5";
import {ThemeType} from "../themes-grid.component";
import {UiTheme} from "@vcd/bindings/vcloud/rest/openapi/model";
import {Observable} from "rxjs";

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
    isEditing = false;
    controlNames = ControlNames;
    errorMessage = "";
    isLoading = false;
    loadingMessageKey = "";
    opened = false;
    selectedFileName = "";
    selectedTheme: UiTheme;
    registerThemeFormGroup = new FormGroup({
        [ControlNames.Name]: new FormControl("", Validators.required),
        [ControlNames.CSS]: new FormControl(null)
    });

    @Output() registered = new EventEmitter();

    @ViewChild("file") file: ElementRef;

    constructor(private brandingService: BrandingService) {}

    close() {
        this.errorMessage = "";
        this.opened = false;
    }

    open(uiTheme?: UiTheme) {
        this.isEditing = !!uiTheme;
        this.selectedTheme = uiTheme;

        this.clearSelectedFile();

        this.registerThemeFormGroup.reset({
            [ControlNames.Name]: uiTheme ? uiTheme.name : ""
        });
        if (uiTheme) {
            this.registerThemeFormGroup.get(ControlNames.CSS).clearValidators();
        } else {
            this.registerThemeFormGroup.get(ControlNames.CSS).setValidators(Validators.required);
        }
        this.registerThemeFormGroup.get(ControlNames.CSS).updateValueAndValidity();

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
        this.loadingMessageKey = this.isEditing ? "com.vmware.plugin-lifecycle.themes.edit.loadingMessage" :
                                    "com.vmware.plugin-lifecycle.themes.register.loadingMessage";
        this.errorMessage = "";

        const name = this.registerThemeFormGroup.get(ControlNames.Name).value;
        const file = this.registerThemeFormGroup.get(ControlNames.CSS).value;

        let observable: Observable<UiTheme>; // Register/Update observable
        if (this.isEditing) {
            observable = this.brandingService.update(this.selectedTheme.name, {
                ...this.selectedTheme,
                name: name
            }, file);
        } else {
            observable = this.brandingService
                .registerTheme({
                    name: name,
                    themeType: ThemeType.CUSTOM
                }, file);
        }

        observable.subscribe(() => {
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
