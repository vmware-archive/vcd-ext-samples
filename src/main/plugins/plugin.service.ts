import {Injectable} from "@angular/core";
import {VcdApiClient} from "@vcd/sdk/client";
import {Observable} from "rxjs";
import {
    ApiPlugin,
    ApiPluginTenant,
    PluginSpec,
    PluginTenantSpec,
    toApiPlugin,
    toApiPluginTenants,
    toPluginSpec, toPluginSpecs,
    toPluginTenantSpecs
} from "./plugin.model";
import {OrganizationService} from "../common/services/organization.service";

@Injectable()
export class PluginService {

    constructor(private client: VcdApiClient, private organizationService: OrganizationService) {
    }

    public getPlugins(): Observable<PluginSpec[]> {
        return this.client
            .get<ApiPlugin[]>("cloudapi/extensions/ui/")
            .map(toPluginSpecs);
    }

    public createPlugin(pluginSpec: PluginSpec): Observable<PluginSpec> {
        return this.client
            .createSync<ApiPlugin>("cloudapi/extensions/ui", toApiPlugin(pluginSpec))
            .map(toPluginSpec);
    }

    public deletePlugin(pluginSpec: PluginSpec): Observable<void> {
        return this.client.deleteSync(`cloudapi/extensions/ui/${pluginSpec.id}`);
    }

    public disablePlugin(pluginSpec: PluginSpec): Observable<PluginSpec> {
        pluginSpec = {...pluginSpec, enabled: false};
        return this.updatePlugin(pluginSpec);
    }

    public enablePlugin(pluginSpec: PluginSpec): Observable<PluginSpec> {
        pluginSpec = {...pluginSpec, enabled: true};
        return this.updatePlugin(pluginSpec);
    }

    public updatePlugin(pluginSpec: PluginSpec): Observable<PluginSpec> {
       return this.client
            .updateSync(`cloudapi/extensions/ui/${pluginSpec.id}`, toApiPlugin(pluginSpec))
            .map(toPluginSpec);
    }

    public getAllTenants(): Observable<PluginTenantSpec[]> {
        return this.organizationService.getAllTenants()
            .map((results) => toPluginTenantSpecs(results));
    }

    public getPluginTenants(pluginSpec: PluginSpec): Observable<PluginTenantSpec[]> {
        return this.client
            .get<ApiPluginTenant[]>(`cloudapi/extensions/ui/${pluginSpec.id}/tenants`)
            .map(toPluginTenantSpecs);
    }

    public publishToTenants(pluginSpec: PluginSpec, pluginTenantSpecs: PluginTenantSpec[]) {
        return this.client
            .createSync<ApiPluginTenant[]>(
                `cloudapi/extensions/ui/${pluginSpec.id}/tenants/publish`,
                toApiPluginTenants(pluginTenantSpecs)
            ).map(toPluginTenantSpecs);
    }

    public publishToAllTenants(pluginSpec: PluginSpec) {
        return this.client
            .createSync<ApiPluginTenant[]>(
                `cloudapi/extensions/ui/${pluginSpec.id}/tenants/publishAll`,
                null
            ).map(toPluginTenantSpecs);
    }

    public unpublishFrom(pluginSpec: PluginSpec, pluginTenantSpecs: PluginTenantSpec[]) {
        return this.client
            .createSync<ApiPluginTenant[]>(
                `cloudapi/extensions/ui/${pluginSpec.id}/tenants/unpublish`,
                toApiPluginTenants(pluginTenantSpecs)
            ).map(toPluginTenantSpecs);
    }

    public unpublishFromAllTenants(pluginSpec: PluginSpec) {
        return this.client
            .createSync<ApiPluginTenant[]>(
                `cloudapi/extensions/ui/${pluginSpec.id}/tenants/unpublishAll`,
                null
            ).map(toPluginTenantSpecs);
    }
}
