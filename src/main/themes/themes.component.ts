import {Component, OnInit, ViewChild} from "@angular/core";

import {BehaviorSubject} from "rxjs";

import {ErrorType} from "@vcd/bindings/vcloud/api/rest/schema_v1_5";
import {UiTheme} from "@vcd/bindings/vcloud/rest/openapi/model";

import {BrandingService} from "../common/services/branding.service";

import {RegisterThemeModalComponent} from "./register/register_theme.component";
import {RemoveThemeModalComponent} from "./remove/remove_theme.component";
import {PublishThemeComponent} from "./publish/publish_theme.component";





@Component({
    selector: "vcd-ext-themes",
    templateUrl: "./themes.component.html"
})
export class ThemesComponent implements OnInit {
    private refreshSubject = new BehaviorSubject<boolean>(true);

    errorMessage = "";
    isLoading = true;
    themes: UiTheme[] = [];

    @ViewChild("publishModal") publishModal: PublishThemeComponent;
    @ViewChild("registerModal") registerModal: RegisterThemeModalComponent;
    @ViewChild("removeModal") removeModal: RemoveThemeModalComponent;

    constructor(private brandingService: BrandingService) {}

    ngOnInit() {
        this.refreshThemes();
    }

    openPublishModal(selectedTheme: UiTheme) {
        this.publishModal.open(selectedTheme);
    }

    openRegisterModal(uiTheme?: UiTheme) {
        this.registerModal.open(uiTheme);
    }

    openRemoveModal(selectedTheme: UiTheme) {
        this.removeModal.open(selectedTheme.name);
    }

    refreshThemes() {
        this.isLoading = true;
        this.refreshSubject
            .switchMap(() => this.brandingService.getThemes().take(1))
            .subscribe((themes: UiTheme[]) => {
                this.isLoading = false;
                this.errorMessage = "";
                this.themes = themes;
            }, (error: ErrorType) => {
                this.isLoading = false;
                this.errorMessage = (error && error.message) || "Failed to execute the request";
                this.themes = [];
            });
    }
}
