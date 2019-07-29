import {Component, OnInit, ViewChild} from "@angular/core";
import {Observable, Subscription} from "rxjs";
import {PluginUploadOperationSpec, PublishPluginsOperationSpec} from "./plugin-operations.model";
import {PluginOperationsService} from "./plugin-operations.service";
import {PluginSpec} from "./plugin.model";
import {PluginService} from "./plugin.service";
import {PublishModalComponent} from "./publish-modal.component";
import {UploadWizardComponent} from "./upload-wizard.component";

@Component({
    selector: "vcd-ext-plugins",
    templateUrl: "./plugins.component.html"
})
export class PluginsComponent implements OnInit {
    @ViewChild("publishModal")
    publishModal: PublishModalComponent;

    @ViewChild("uploadWizard")
    uploadWizard: UploadWizardComponent;

    selectedPlugins: PluginSpec[] = [];
    plugins: PluginSpec[] = [];
    activityError: string = null;

    deleteModalOpened = false;

    private activitySubscription: Subscription = null;

    constructor(private pluginService: PluginService, private pluginOperationsService: PluginOperationsService) {
    }

    ngOnInit() {
        this.refresh();
    }

    refresh() {
        if (this.activitySubscription != null) {
            this.activitySubscription.unsubscribe();
        }

        this.activitySubscription = this.pluginService.getPlugins()
            .subscribe((result) => {
                this.plugins = result;
                this.activitySubscription = null;
            }, (error) => {
                this.activityError = error.message;
                this.activitySubscription = null;
            });
    }

    get loading() {
        return this.activitySubscription != null;
    }

    get canRefresh() {
        return !this.loading;
    }

    get canUpload() {
        return !this.loading;
    }

    get canEnableSelected() {
        const allDisabled = this.selectedPlugins
            .reduce((acc, plugin) => acc && !plugin.enabled, true);
        return !this.loading
            && this.selectedPlugins.length > 0
            && allDisabled;
    }

    get canDisableSelected() {
        const allEnabled = this.selectedPlugins
            .reduce((acc, plugin) => acc && plugin.enabled, true);
        return !this.loading
            && this.selectedPlugins.length > 0
            && allEnabled;
    }

    get canDeleteSelected() {
        return !this.loading
            && this.selectedPlugins.length > 0;
    }

    get canPublishSelected() {
        return !this.loading
            && this.selectedPlugins.length > 0;
    }

    onRefreshClick() {
        this.refresh();
    }

    onUploadClick() {
        this.uploadWizard.open();
    }

    onDisableSelectedClick() {
        if (this.activitySubscription != null) {
            this.activitySubscription.unsubscribe();
        }

        this.activitySubscription = this.pluginOperationsService
            .disablePlugins({plugins: this.selectedPlugins})
            .subscribe((result) => {
                this.plugins = result.plugins;
                this.activitySubscription = null;
            }, (error) => {
                console.error(error);
                this.activitySubscription = null;
                this.activityError = error.message;
            });
    }

    onEnableSelectedClick() {
        if (this.activitySubscription != null) {
            this.activitySubscription.unsubscribe();
        }

        this.activitySubscription = this.pluginOperationsService
            .enablePlugins({plugins: this.selectedPlugins})
            .subscribe((result) => {
                this.plugins = result.plugins;
                this.activitySubscription = null;
            }, (error) => {
                console.error(error);
                this.activitySubscription = null;
                this.activityError = error.message;
            });
    }

    onDeleteClick() {
        this.deleteModalOpened = true;
    }

    onDeleteModalCancelClick() {
        this.deleteModalOpened = false;
    }

    onDeleteModalDeleteClick() {
        if (this.activitySubscription != null) {
            this.activitySubscription.unsubscribe();
        }

        this.deleteModalOpened = false;
        this.activitySubscription = this.pluginOperationsService
            .deletePlugins({plugins: this.selectedPlugins})
            .subscribe((result) => {
                this.plugins = result.plugins;
                this.activitySubscription = null;
            }, (error) => {
                console.error(error);
                this.activitySubscription = null;
                this.activityError = error.message;
            });
    }

    onPublishSelectedClick() {
        this.publishModal.open(this.selectedPlugins);
    }

    onPluginUploaded(operation: PluginUploadOperationSpec) {
        this.refresh();
    }

    onPluginsPublished(operation: PublishPluginsOperationSpec) {
        this.refresh();
    }

}
