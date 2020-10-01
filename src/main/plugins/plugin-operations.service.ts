import {Injectable} from "@angular/core";
import {TransferProgress} from "@vcd/sdk/client/vcd.transfer.client";
import {Observable, Observer} from "rxjs";
import {flatMap, map} from "rxjs/operators";
import {PluginBundleService} from "./plugin-bundle.service";
import {BasicPluginsOperationSpec, PluginUploadOperationSpec, PublishPluginsOperationSpec} from "./plugin-operations.model";
import {PluginSpec} from "./plugin.model";
import {PluginService} from "./plugin.service";

@Injectable()
export class PluginOperationsService {

    constructor(private pluginService: PluginService, private pluginBundleService: PluginBundleService) {
    }

    disablePlugins(operationState: BasicPluginsOperationSpec): Observable<BasicPluginsOperationSpec> {
        return this.performBasicOperation(operationState, (plugin) => this.pluginService.disablePlugin(plugin));
    }

    enablePlugins(operationState: BasicPluginsOperationSpec): Observable<BasicPluginsOperationSpec> {
        return this.performBasicOperation(operationState, (plugin) => this.pluginService.enablePlugin(plugin));
    }

    deletePlugins(operationState: BasicPluginsOperationSpec): Observable<BasicPluginsOperationSpec> {
        return this.performBasicOperation(operationState, (plugin) => this.pluginService.deletePlugin(plugin));
    }

    private performBasicOperation(state: BasicPluginsOperationSpec,
                                  operation: (plugin: PluginSpec) => Observable<any>): Observable<BasicPluginsOperationSpec> {
        const observables =
            state.plugins.map((plugin) => operation(plugin));
        return Observable.forkJoin(observables)
            .flatMap(() => this.pluginService.getPlugins())
            .map((plugins) => ({plugins}));
    }


    uploadPlugin(uploadState: PluginUploadOperationSpec, progressListener: Observer<TransferProgress>) {
        return Observable.of(uploadState)
            .pipe(
                flatMap((state) => this.createPlugin(state)),
                flatMap((state) => this.publishToTenants(state)),
                flatMap((state) => this.transferPluginBundle(state, progressListener))
            );
    }

    private createPlugin(state: PluginUploadOperationSpec): Observable<PluginUploadOperationSpec> {
        return this.pluginService
            .createPlugin(state.plugin)
            .pipe(
                map((createdPlugin) => ({...state, plugin: createdPlugin}))
            );
    }

    private transferPluginBundle(state: PluginUploadOperationSpec,
                                 uploadingProgress: Observer<TransferProgress>): Observable<PluginUploadOperationSpec> {
        return this.pluginBundleService
            .uploadPluginBundle(state.plugin, state.pluginBundle, uploadingProgress)
            .pipe(
                map(() => state)
            );
    }

    private publishToTenants(state: PluginUploadOperationSpec) {
        return (state.publishToAll ?
            this.pluginService.publishToAllTenants(state.plugin) :
            this.pluginService.publishToTenants(state.plugin, state.tenants)
        ).pipe(
            map((tenants) => ({...state, tenants}))
        );
    }

    publishPlugins(publishState: PublishPluginsOperationSpec): Observable<PublishPluginsOperationSpec> {
        return Observable.of(publishState)
            .pipe(
                flatMap((state) => this.updatePluginScopes(state)),
                flatMap((state) => this.unpublishFromAllTenants(state)),
                flatMap((state) => this.republishToTenants(state))
            );
    }


    private updatePluginScopes(state: PublishPluginsOperationSpec) {
        const actions = state.plugins
            .map((plugin) => {
                const updatedPlugin = {
                    ...plugin,
                    providerScoped: state.providerScoped,
                    tenantScoped: state.tenantScoped
                };
                return this.pluginService.updatePlugin(updatedPlugin);
            });
        return Observable.forkJoin(actions)
            .pipe(
                map((plugins) => ({...state, plugins}))
            );
    }

    private unpublishFromAllTenants(state: PublishPluginsOperationSpec) {
        const actions = state.plugins
            .map((plugin) => this.pluginService.unpublishFromAllTenants(plugin));
        return Observable.forkJoin(actions)
            .pipe(
                map(() => state)
            );
    }

    private republishToTenants(state: PublishPluginsOperationSpec) {
        const actions = state.plugins
            .map((plugin) => {
                if (state.publishToAll) {
                    return this.pluginService.publishToAllTenants(plugin);
                }

                return this.pluginService.publishToTenants(plugin, state.tenants)
            });
        return Observable.forkJoin(actions)
            .pipe(
                map(() => state)
            );
    }

}
