import * as JSZip from "jszip";

export interface PluginBundleManifestSpec {
    name: string;
    vendor: string;
    description?: string;
    version: string;
    license: string;
    link: string;
    scope: string[];
    [field: string]: any;
}

export interface PluginBundleSpec {
    file: File;
    zip: JSZip;
    filenames: string[];
    manifest: PluginBundleManifestSpec;
}
