import {Component, EventEmitter, Output} from "@angular/core";
import {FormArray, FormControl, FormGroup, ValidatorFn} from "@angular/forms";
import {OrganizationService} from "../../common/services/organization.service";
import {ErrorType, QueryResultOrgRecordType} from "@vcd/bindings/vcloud/api/rest/schema_v1_5";
import {Observable} from "rxjs";
import {UiBranding, UiTheme} from "@vcd/bindings/vcloud/rest/openapi/model";
import {BrandingService} from "../../common/services/branding.service";
import {concatAll, merge} from "rxjs/operators";
import {ObjectHelper} from "../../common/utils";

enum ControlNames {
    Provider = "provider",
    AllTenants = "allTenants",
    Tenants = "tenants"
}

@Component({
    selector: "vcd-ext-publish-theme",
    templateUrl: "./publish_theme.component.html",
    styleUrls: ["./publish_theme.component.scss"]
})
export class PublishThemeComponent {
    controlNames = ControlNames;
    errorMessage = "";
    isLoading = false;
    loadingMessageKey = "";
    opened = false;
    selectedTheme: UiTheme;
    tenants: QueryResultOrgRecordType[] = [];

    form = new FormGroup({
        [ControlNames.Provider]: new FormControl(false),
        [ControlNames.AllTenants]: new FormControl(false),
        [ControlNames.Tenants]: new FormArray([])
    }, this.hasSelection());

    @Output() published = new EventEmitter();

    constructor(private organizationService: OrganizationService, private brandingService: BrandingService) {
        this.form.get(ControlNames.AllTenants).valueChanges.subscribe((value: boolean) => {
            this.form.get(ControlNames.Tenants).setValue(new Array(this.tenants.length).fill(value), {emitEvent: false});
        });

        this.form.get(ControlNames.Tenants).valueChanges.subscribe((values: boolean[]) => {
            this.form.get(ControlNames.AllTenants).setValue(values.length && values.indexOf(false) === -1, {emitEvent: false});
        });
    }

    close () {
        this.errorMessage = "";
        this.selectedTheme = null;
        this.opened = false;
    }

    open(theme: UiTheme) {
        this.selectedTheme = ObjectHelper.clone(theme);
        // Form reset
        this.form.reset();
        // Reset Tenants list
        const tenantsLength = (this.form.get(ControlNames.Tenants) as FormArray).controls.length;
        if (tenantsLength > 0) {
            for (let i = tenantsLength; i >= 0; i--) {
                (this.form.get(ControlNames.Tenants) as FormArray).removeAt(i);
            }
        }

        // Fetch tenants and populate the form controls
        this.updateTenantsList();
        this.opened = true;
    }

    private updateTenantsList() {
        this.isLoading = true;
        this.loadingMessageKey = "com.vmware.plugin-lifecycle.themes.publish.loadingTenants";
        this.organizationService.getAllTenants()
            .subscribe((tenants: QueryResultOrgRecordType[]) => {
                this.isLoading = false;
                this.loadingMessageKey = "";
                this.tenants = tenants;
                tenants.forEach((tenant: QueryResultOrgRecordType) => {
                    (this.form.get(ControlNames.Tenants) as FormArray).push(new FormControl(false));
                });
            }, (error: ErrorType) => {
                this.loadingMessageKey = "";
                this.errorMessage = error.message;
                this.isLoading = false;
            });
    }

    private hasSelection(): ValidatorFn {
        return (form: FormGroup) => {
            return (form.get(ControlNames.Provider).value || (form.get(ControlNames.Tenants) as FormArray).value.indexOf(true) !== -1) ?
                null : {notSelected: true};
        };
    }

    publish() {
        this.isLoading = true;
        this.loadingMessageKey = "com.vmware.plugin-lifecycle.themes.publish.loadingMessage";

        let observables: Observable<UiBranding>[] = [];

        // If SP selected, add SP call to the list of calls.
        if (this.form.get(ControlNames.Provider).value) {
            observables = [...observables, this.brandingService.publishTheme(this.selectedTheme)];
        }

        // Iterrate Tenants and add calls to the list of calls.
        (this.form.get(ControlNames.Tenants) as FormArray).value.forEach((value: boolean, index: number) => {
            if (value) {
                observables = [...observables, this.brandingService.publishTheme(this.selectedTheme, this.tenants[index].name)];
            }
        });

        Observable.from(observables)
            .pipe(
                concatAll()
            )
            .subscribe(() => {}, (error: ErrorType) => {
                this.isLoading = false;
                this.loadingMessageKey = "";
                this.errorMessage = error.message;
                this.published.emit();
            }, () => {
                this.isLoading = false;
                this.loadingMessageKey = "";
                this.close();
            });
    }
}
