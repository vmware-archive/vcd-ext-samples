import {Component, EventEmitter, Output} from "@angular/core";
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {Observable, Subscription} from "rxjs";
import {flatMap} from "rxjs/operators";
import {PublishPluginsOperationSpec} from "./plugin-operations.model";
import {PluginOperationsService} from "./plugin-operations.service";
import {PluginSpec, PluginTenantSpec} from "./plugin.model";
import {PluginService} from "./plugin.service";

interface InitialPublishFormDataSpec {
    pluginsById: Map<string, PluginSpec>;
    tenantsById: Map<string, PluginTenantSpec>;
    tenantScoped: "all" | "none" | "some";
    providerScoped: "all" | "none" | "some";
    tenantSelections: Map<string, "all" | "none" | "some">;
}

@Component({
    selector: "vcd-ext-publish-form",
    templateUrl: "./publish-form.component.html"
})
export class PublishFormComponent {

    @Output()
    published = new EventEmitter<PublishPluginsOperationSpec>();

    activityError: string;
    allTenantsChecked = false;
    pluginsById: Map<string, PluginSpec>;
    tenantsById: Map<string, PluginTenantSpec>;
    form = new FormGroup({
        tenantScoped: new FormGroup({
            selected: new FormControl(false),
            indeterminate: new FormControl(false)
        }),
        providerScoped: new FormGroup({
            selected: new FormControl(false),
            indeterminate: new FormControl(false)
        }),
        publishToTenants: new FormArray([])
    });
    filterControl = new FormControl("");

    private activitySubscription: Subscription = null;

    constructor(private pluginService: PluginService, private pluginOperationsService: PluginOperationsService) {
    }

    setAllTenantsSelectedTo(selected: boolean) {
        const formArray = <FormArray>this.form.controls.publishToTenants;
        for (let i = 0; i < formArray.length; i++) {
            const formGroup = <FormGroup>formArray.at(i);
            const oldValue = {...formGroup.value};
            formGroup.setValue({...oldValue, selected, indeterminate: false});
        }

        if (selected && !this.form.dirty) {
            this.form.markAsDirty();
        }
    }

    isFilterMatching(tenantId: string) {
        const filterValue: string = this.filterControl.value;
        if (!filterValue || !filterValue.trim()) {
            return true;
        }

        const tenant = this.tenantsById.get(tenantId);
        return tenant.name.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1;
    }

    get dirty() {
        return this.form.dirty;
    }

    get publishPluginsOperation(): PublishPluginsOperationSpec {
        const formValue = this.form.value;
        const plugins: PluginSpec[] = [];
        const tenantScoped: boolean = formValue.tenantScoped.selected;
        const providerScoped: boolean = formValue.providerScoped.selected;
        const tenants: PluginTenantSpec[] = [];
        this.pluginsById.forEach((plugin) => plugins.push(plugin));
        formValue.publishToTenants.forEach((selection: {tenantId: string, selected: boolean}) => {
            if (selection.selected) {
                tenants.push(this.tenantsById.get(selection.tenantId));
            }
        });
        return {plugins, tenantScoped, providerScoped, tenants};
    }

    get loading() {
        return this.activitySubscription != null;
    }

    get showTenants() {
        return this.form.controls.tenantScoped.value.selected;
    }

    reset(plugins: PluginSpec[] = [], selectScopes: {tenantScoped?: boolean, providerScoped?: boolean} = {}) {
        if (this.activitySubscription) {
            this.activitySubscription.unsubscribe();
        }
        this.activityError = null;

        const activity = plugins.length
            ? this.loadInitialFormDataFromPlugins(plugins)
            : this.loadBlankInitialFormData();
        this.activitySubscription = activity
            .subscribe(
            (initialData) => {
                this.updateViewModel(initialData);
                if (typeof selectScopes.tenantScoped !== "undefined") {
                    (<FormGroup>this.form.controls.tenantScoped)
                        .controls.selected.setValue(selectScopes.tenantScoped);
                }
                if (typeof selectScopes.providerScoped !== "undefined") {
                    (<FormGroup>this.form.controls.providerScoped)
                        .controls.selected.setValue(selectScopes.providerScoped);
                }
                this.activitySubscription = null;
            }, (error) => {
                console.error(error);
                this.activitySubscription = null;
                this.activityError = error.message;
            });
    }

    publish() {
        this.activitySubscription = this.pluginOperationsService
            .publishPlugins(this.publishPluginsOperation)
            .subscribe((result) => {
                this.activitySubscription = null;
                this.published.emit(result);
            }, (error) => {
                console.error(error);
                this.activitySubscription = null;
                this.activityError = error.message;
            });
    }

    private loadBlankInitialFormData() {
        const base: InitialPublishFormDataSpec = {
            pluginsById: new Map(),
            tenantsById: null,
            tenantScoped: "none",
            providerScoped: "none",
            tenantSelections: null
        };
        return Observable.of(base)
            .pipe(
                flatMap((initialData) => this.loadKnownTenants(initialData)),
                flatMap((initialData) => this.loadBlankTenantSelections(initialData))
            );
    }

    private loadInitialFormDataFromPlugins(plugins: PluginSpec[]) {
        const tenantScopeCount = plugins.reduce((count, plugin) => plugin.tenantScoped ? count + 1 : count, 0);
        const providerScopeCount = plugins.reduce((count, plugin) => plugin.providerScoped ? count + 1 : count, 0);
        const pluginsById = new Map<string, PluginSpec>();
        plugins.forEach((plugin) => pluginsById.set(plugin.id, plugin));

        const base: InitialPublishFormDataSpec = {
            pluginsById,
            tenantsById: null,
            tenantScoped: tenantScopeCount === plugins.length ? "all"
                : tenantScopeCount === 0 ? "none"
                    : "some",
            providerScoped: providerScopeCount === plugins.length ? "all"
                : providerScopeCount === 0 ? "none"
                    : "some",
            tenantSelections: null
        };
        return Observable.of(base)
            .pipe(
                flatMap((initialData) => this.loadKnownTenants(initialData)),
                flatMap((initialData) => this.loadPluginTenantSelections(initialData))
            );
    }

    private loadKnownTenants(viewModel: InitialPublishFormDataSpec): Observable<InitialPublishFormDataSpec> {
        return this.pluginService.getAllTenants()
            .map((knownTenants) => {
                const tenantsById = new Map<string, PluginTenantSpec>();
                knownTenants.forEach((tenant) => tenantsById.set(tenant.id, tenant));
                return {
                    ...viewModel,
                    tenantsById
                };
            });
    }

    private loadPluginTenantSelections(viewModel: InitialPublishFormDataSpec): Observable<InitialPublishFormDataSpec> {
        const pluginTenantFetches: Observable<{ pluginId: string, tenants: PluginTenantSpec[] }>[] = [];
        viewModel.pluginsById.forEach((plugin) =>
            pluginTenantFetches.push(this.pluginService
                .getPluginTenants(plugin)
                .map((tenants) => ({pluginId: plugin.id, tenants}))
            )
        );
        return Observable.forkJoin(pluginTenantFetches)
            .map((results) => {
                const tenantPluginCounts = new Map<string, number>();
                results.forEach((result) => {
                    result.tenants.forEach((tenant) => {
                        const tenantPluginCount = (tenantPluginCounts.get(tenant.id) || 0);
                        tenantPluginCounts.set(tenant.id, tenantPluginCount + 1);
                    });
                });

                const tenantSelections = new Map<string, "all" | "some" | "none">();
                viewModel.tenantsById.forEach((tenant, tenantId) => {
                    const tenantPluginCount = tenantPluginCounts.has(tenantId)
                        ? tenantPluginCounts.get(tenantId)
                        : 0;
                    const tenantSelection = tenantPluginCount === viewModel.pluginsById.size ? "all"
                        : tenantPluginCount === 0 ? "none"
                            : "some";
                    tenantSelections.set(tenantId, tenantSelection);
                });
                return {...viewModel, tenantSelections};
            });
    }

    private loadBlankTenantSelections(viewModel: InitialPublishFormDataSpec): Observable<InitialPublishFormDataSpec> {
        const tenantSelections = new Map<string, "all" | "some" | "none">();
        viewModel.tenantsById.forEach((tenant) => tenantSelections.set(tenant.id, "none"));
        return Observable.of({...viewModel, tenantSelections});
    }

    private updateViewModel(initialData: InitialPublishFormDataSpec) {
        this.pluginsById = initialData.pluginsById;
        this.tenantsById = initialData.tenantsById;

        const tenantScoped = new FormGroup({
            selected: new FormControl(initialData.tenantScoped !== "none"),
            indeterminate: new FormControl(initialData.tenantScoped === "some")
        });

        const providerScoped = new FormGroup({
            selected: new FormControl(initialData.providerScoped !== "none"),
            indeterminate: new FormControl(initialData.providerScoped === "some")
        });

        const publishToTenants = new FormArray([]);
        initialData.tenantSelections.forEach((selection, tenantId) => {
            const formGroup = new FormGroup({
                tenantId: new FormControl(tenantId),
                selected: new FormControl(selection !== "none"),
                indeterminate: new FormControl(selection === "some")
            });
            publishToTenants.push(formGroup);
        });
        publishToTenants.valueChanges.subscribe((values: {selected: boolean, indeterminate: boolean}[]) => {
            const totalSelected = values.reduce(
                (current, next) => (next.selected && !next.indeterminate) ? current + 1 : current, 0);
            this.allTenantsChecked = (totalSelected === this.tenantsById.size);
        });

        this.form = new FormGroup({tenantScoped, providerScoped, publishToTenants});
        this.form.valueChanges.subscribe(() => {
            tenantScoped.controls.indeterminate.reset(false, {emitEvent: false});
            providerScoped.controls.indeterminate.reset(false, {emitEvent: false});
            publishToTenants.controls.forEach((tenantGroup: FormGroup) => {
                tenantGroup.controls.indeterminate.reset(false, {emitEvent: false});
            });

            const tenantValues: {selected: boolean, indeterminate: boolean}[] = publishToTenants.value;
            const totalTenantsSelected = tenantValues.reduce(
                (current, next) => (next.selected && !next.indeterminate) ? current + 1 : current, 0);
            this.allTenantsChecked = (totalTenantsSelected === this.tenantsById.size);
        });

        this.filterControl.reset();
    }

}
