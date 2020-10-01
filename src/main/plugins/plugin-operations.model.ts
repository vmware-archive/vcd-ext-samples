import {PluginBundleSpec} from "./plugin-bundle.model";
import {PluginSpec, PluginTenantSpec} from "./plugin.model";

export interface BasicPluginsOperationSpec {
    plugins: PluginSpec[];
}

export interface PublishPluginsOperationSpec {
    plugins: PluginSpec[];
    providerScoped: boolean;
    tenantScoped: boolean;
    tenants: PluginTenantSpec[];
    publishToAll: boolean;
}

export interface PluginUploadOperationSpec {
    plugin: PluginSpec;
    pluginBundle: PluginBundleSpec;
    tenants: PluginTenantSpec[];
    publishToAll: boolean;
}
