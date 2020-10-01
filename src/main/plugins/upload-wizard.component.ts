import {Component, EventEmitter, Output, ViewChild} from "@angular/core";
import {TransferProgress} from "@vcd/sdk/client/vcd.transfer.client";
import {Wizard} from "clarity-angular";
import {Subject, Subscription} from "rxjs";
import {PluginBundleSpec} from "./plugin-bundle.model";
import {PluginBundleService} from "./plugin-bundle.service";
import {PluginUploadOperationSpec, PublishPluginsOperationSpec} from "./plugin-operations.model";
import {PluginOperationsService} from "./plugin-operations.service";
import {PluginSpec} from "./plugin.model";
import {PublishFormComponent} from "./publish-form.component";

@Component({
    selector: "vcd-ext-upload-wizard",
    templateUrl: "./upload-wizard.component.html"
})
export class UploadWizardComponent {
    @ViewChild("wizard")
    wizard: Wizard;

    @ViewChild("publishForm")
    publishForm: PublishFormComponent;

    @Output()
    uploaded = new EventEmitter<PluginUploadOperationSpec>();

    opened = false;
    pluginBundle: PluginBundleSpec = null;
    publishOperation: PublishPluginsOperationSpec = null;

    activityError: string = null;
    private activitySubscription: Subscription = null;

    uploadingProgress: Subject<TransferProgress> = null;

    constructor(
        private pluginBundleService: PluginBundleService,
        private pluginOperationsService: PluginOperationsService
    ) {
    }

    get loading() {
        return this.activitySubscription != null;
    }

    get uploading() {
        return this.uploadingProgress != null;
    }

    open() {
        this.wizard.reset();
        this.uploadingProgress = null;
        this.activityError = null;
        this.pluginBundle = null;
        this.publishOperation = null;
        this.opened = true;
    }

    loadPluginBundle(file: File) {
        if (this.activitySubscription) {
            this.activitySubscription.unsubscribe();
        }

        this.activitySubscription = this.pluginBundleService
            .readPluginBundle(file)
            .subscribe((result) => {
                const tenantScoped = result.manifest.scope.indexOf("tenant") !== -1;
                const providerScoped = result.manifest.scope.indexOf("service-provider") !== -1;
                this.publishForm.reset([], {tenantScoped, providerScoped});
                this.pluginBundle = result;
                this.activitySubscription = null;
            }, (error) => {
                console.error(error);
                this.activityError = error.message;
                this.activitySubscription = null;
            });
    }

    onSelectPluginClick() {
        const input = document.createElement("input");
        input.type = "file";
        input.onchange = (event: any) => {
            const file: File = event.target.files[0];
            this.loadPluginBundle(file);
        };
        input.click();
    }

    onPublishFormFinished() {
        this.publishOperation = this.publishForm.publishPluginsOperation;
    }

    onWizardFinished() {
        const providerScoped = this.publishOperation.providerScoped;
        const tenantScoped = this.publishOperation.tenantScoped;
        const plugin: PluginSpec = {
            name: this.pluginBundle.manifest.name,
            vendor: this.pluginBundle.manifest.vendor,
            description: this.pluginBundle.manifest.description,
            version: this.pluginBundle.manifest.version,
            license: this.pluginBundle.manifest.license,
            link: this.pluginBundle.manifest.link,
            enabled: true,
            providerScoped,
            tenantScoped
        };
        const upload: PluginUploadOperationSpec = {
            plugin,
            pluginBundle: this.pluginBundle,
            tenants: this.publishOperation.tenants
        };
        this.uploadingProgress = new Subject<TransferProgress>();
        this.activitySubscription = this.pluginOperationsService
            .uploadPlugin(upload, this.uploadingProgress)
            .subscribe(
                (state) => {
                    this.uploadingProgress = null;
                    this.uploaded.emit(state);
                    this.activitySubscription = null;
                    this.opened = false;
                },
                (error) => {
                    console.error(error);
                    this.uploadingProgress = null;
                    this.activityError = error.message;
                    this.activitySubscription = null;
                }
            );
    }
}
