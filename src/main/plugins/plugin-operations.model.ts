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
}

export interface PluginUploadOperationSpec {
    plugin: PluginSpec;
    pluginBundle: PluginBundleSpec;
    tenants: PluginTenantSpec[];
}
