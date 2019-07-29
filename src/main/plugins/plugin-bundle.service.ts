import {Injectable} from "@angular/core";
import {VcdApiClient} from "@vcd/sdk";
import {TransferProgress} from "@vcd/sdk/client/vcd.transfer.client";
import * as JSZip from "jszip";
import {Observable, Observer, Subject} from "rxjs";
import {flatMap, map} from "rxjs/operators";
import {PluginBundleSpec} from "./plugin-bundle.model";
import {PluginSpec} from "./plugin.model";

@Injectable()
export class PluginBundleService {

    constructor(private vcdApiClient: VcdApiClient) {
    }

    uploadPluginBundle(plugin: PluginSpec, pluginBundleSpec: PluginBundleSpec, progressListener?: Observer<TransferProgress>) {
        const body = {
            fileName: pluginBundleSpec.file.name,
            size: pluginBundleSpec.file.size
        };
        return this.vcdApiClient
            .startTransfer(`cloudapi/extensions/ui/${plugin.id}/plugin`, body)
            .pipe(
                flatMap((transferClient) => transferClient.upload(pluginBundleSpec.file, progressListener))
            );
    }

    readPluginBundle(file: File): Observable<PluginBundleSpec> {
        const basePluginBundleSpec: PluginBundleSpec = {
            file,
            zip: null,
            filenames: [],
            manifest: null
        };
        return Observable.of(basePluginBundleSpec)
            .pipe(
                flatMap((pluginBundleSpec) => {
                    const promise = new JSZip().loadAsync(pluginBundleSpec.file);
                    return Observable.fromPromise(promise)
                        .pipe(
                            map((zip: JSZip) => ({
                                ...pluginBundleSpec,
                                zip
                            }))
                        );
                }),

                map((pluginBundleSpec) => {
                    return {
                        ...pluginBundleSpec,
                        filenames: Object.keys(pluginBundleSpec.zip.files)
                    };
                }),

                flatMap((pluginBundleSpec) => {
                    const manifestFile = pluginBundleSpec.zip.files["manifest.json"];
                    if (!manifestFile) {
                        throw new Error("manifest.json not found in bundle");
                    }

                    const manifestContentsAsync: Promise<string> = manifestFile.async("text");
                    return Observable.fromPromise(manifestContentsAsync)
                        .pipe(
                            map((manifestContents) => JSON.parse(manifestContents)),
                            map((manifest) => ({
                                ...pluginBundleSpec,
                                    manifest
                            }))
                        );
                })
           );
    }

    validatePluginBundle(pluginBundle: PluginBundleSpec): boolean {
        for (const filename of pluginBundle.filenames) {
            const valid = /^(?!..\/)(((manifest|i18n|).(json)$)|((bundle).(js)$)|([0-9]|[a-z]+\/)([0-9]|[a-z]+).*[^exe]$)/gm
                .test(filename);
            if (!valid) {
                return false;
            }
        }

        return true;
    }

}
