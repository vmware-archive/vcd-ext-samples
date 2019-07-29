import {EntityReference2, UiPluginMetadataResponse} from "@vcd/bindings/vcloud/rest/openapi/model";
import {plugin} from "postcss";

export type ApiPlugin = UiPluginMetadataResponse;

export type ApiPluginTenant = EntityReference2;

export interface PluginSpec {
    id?: string;
    status?: "unavailable"|"ready";
    name: string;
    vendor: string;
    description?: string;
    version: string;
    license: string;
    link: string;
    enabled: boolean;
    tenantScoped: boolean;
    providerScoped: boolean;
    resourcePath?: string;
}

export interface PluginTenantSpec {
    id: string;
    name: string;
}

export function toApiPlugin(spec: PluginSpec): ApiPlugin {
    return {
        pluginName: spec.name,
        description: spec.description,
        enabled: spec.enabled,
        license: spec.license,
        link: spec.link,
        vendor: spec.vendor,
        version: spec.version,
        tenant_scoped: spec.tenantScoped,
        provider_scoped: spec.providerScoped
    };
}

export function toApiPlugins(specs: PluginSpec[]): ApiPlugin[] {
    return specs.map(toApiPlugin);
}

export function toPluginSpec(api: ApiPlugin): PluginSpec {
    return {
        id: api.id,
        name: api.pluginName,
        description: api.description,
        enabled: api.enabled,
        license: api.license,
        link: api.link,
        status: api.plugin_status,
        vendor: api.vendor,
        version: api.version,
        tenantScoped: api.tenant_scoped,
        providerScoped: api.provider_scoped,
        resourcePath: api.resourcePath
    };
}

export function toPluginSpecs(apis: ApiPlugin[]): PluginSpec[] {
    return apis.map(toPluginSpec);
}

export function toApiPluginTenant(pluginTenantSpec: PluginTenantSpec): ApiPluginTenant {
    return {
        id: pluginTenantSpec.id,
        name: pluginTenantSpec.name
    };
}

export function toApiPluginTenants(pluginTenantSpecs: PluginTenantSpec[]): ApiPluginTenant[] {
    return pluginTenantSpecs.map(toApiPluginTenant);
}

export function toPluginTenantSpec(apiPluginTenant: ApiPluginTenant): PluginTenantSpec {
    return apiPluginTenant as PluginTenantSpec;
}

export function toPluginTenantSpecs(apiPluginTenants: ApiPluginTenant[]): PluginTenantSpec[] {
    return apiPluginTenants as PluginTenantSpec[];
}
