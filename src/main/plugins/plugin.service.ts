import {Injectable} from "@angular/core";
import {QueryResultRecordsType} from "@vcd/bindings/vcloud/api/rest/schema_v1_5";
import {VcdApiClient} from "@vcd/sdk/client";
import {Query} from "@vcd/sdk/query";
import {Observable} from "rxjs";
import {
    ApiPlugin,
    ApiPluginTenant,
    PluginSpec,
    PluginTenantSpec,
    toApiPlugin,
    toApiPluginTenants,
    toPluginSpec, toPluginSpecs,
    toPluginTenantSpecs,
    EntityReferences
} from "./plugin.model";
import {map} from "rxjs/operators";

@Injectable()
export class PluginService {

    constructor(private client: VcdApiClient) {
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
        return this.client
            .query<QueryResultRecordsType>(
                Query.Builder
                    .ofType("organization")
                    .format("idrecords")
                    .sort({field: "name", reverse: false})
            )
            .expand((pageResponse: QueryResultRecordsType) => (!this.client.hasNextPage(pageResponse)
                ? Observable.empty()
                : this.client.nextPage(pageResponse)))
            .map((pageResponse: QueryResultRecordsType) => pageResponse.record as ApiPluginTenant[])
            .reduce((accumulator: ApiPluginTenant[], next: ApiPluginTenant[]) => [...accumulator, ...next])
            .map((results: ApiPluginTenant[]) => toPluginTenantSpecs(results));
    }

    public getPluginTenants(pluginSpec: PluginSpec): Observable<PluginTenantSpec[]> {
        return this.client
            .get<EntityReferences>(`cloudapi/extensions/ui/${pluginSpec.id}/tenants`)
            .expand((res) => {
                return (!this.client.hasNextPage(res)
                ? Observable.empty()
                : this.client.nextPage<EntityReferences>(res)
                )
            })
            .reduce((accumulator: EntityReferences, next: EntityReferences) => {
                accumulator.values = [...accumulator.values, ...next.values]

                return accumulator
            })
            .map((results: EntityReferences) => results.values);
    }

    public publishToTenants(pluginSpec: PluginSpec, pluginTenantSpecs: PluginTenantSpec[]): Observable<PluginTenantSpec[]> {
        return this.client
            .createSync<EntityReferences>(
                `cloudapi/extensions/ui/${pluginSpec.id}/tenants/publish`,
                toApiPluginTenants(pluginTenantSpecs) as any
            ).map((record: EntityReferences) => record.values);
    }

    public publishToAllTenants(pluginSpec: PluginSpec) {
        return this.client
            .createSync<EntityReferences>(
                `cloudapi/extensions/ui/${pluginSpec.id}/tenants/publishAll`,
                null
            ).map((record: EntityReferences) => record.values);
    }

    public unpublishFrom(pluginSpec: PluginSpec, pluginTenantSpecs: PluginTenantSpec[]) {
        return this.client
            .createSync<EntityReferences>(
                `cloudapi/extensions/ui/${pluginSpec.id}/tenants/unpublish`,
                toApiPluginTenants(pluginTenantSpecs) as any
            ).map((record: EntityReferences) => record.values);
    }

    public unpublishFromAllTenants(pluginSpec: PluginSpec) {
        return this.client
            .createSync<EntityReferences>(
                `cloudapi/extensions/ui/${pluginSpec.id}/tenants/unpublishAll`,
                null
            ).map((record: EntityReferences) => record.values);
    }
}
