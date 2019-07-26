import { Injectable } from "@angular/core";

import {Observable, Subject} from "rxjs";

import {UiBranding, UiTheme} from "@vcd/bindings/vcloud/rest/openapi/model";

import { VcdApiClient } from "@vcd/sdk";
import {TransferProgress, TransferResult, VcdTransferClient} from "@vcd/sdk/client/vcd.transfer.client";
import {catchError, switchMap, take} from "rxjs/operators";
import {ErrorType} from "@vcd/bindings/vcloud/api/rest/schema_v1_5";

const BRANDING_BASE_URL = "cloudapi/branding";
const THEMES_BASE_URL = `${BRANDING_BASE_URL}/themes`;


/**
 * Branding Service
 *  - Get/Set Branding
 *  - Get/Update/Register/Remove Themes
 */
@Injectable()
export class BrandingService {
    constructor(private client: VcdApiClient) {}

    getBranding(tenant?: string): Observable<UiBranding> {
        return this.client
            .get<UiBranding>(tenant ? `${BRANDING_BASE_URL}/tenant/${tenant}` : BRANDING_BASE_URL)
            .pipe(take(1));
    }

    setBranding(branding: UiBranding, tenant?: string): Observable<UiBranding> {
        return this.client
            .updateSync((tenant ? `${BRANDING_BASE_URL}/tenant/${tenant}` : BRANDING_BASE_URL), branding)
            .pipe(take(1));
    }

    getThemes(): Observable<UiTheme[]> {
        return this.client
                .get<UiTheme[]>(THEMES_BASE_URL)
                .pipe(
                    take(1),
                    catchError((error) => Observable.throw(error))
                );
    };

    publishTheme(theme: UiTheme, tenant?: string): Observable<UiBranding> {
        return this.getBranding(tenant)
            .pipe(
                take(1),
                switchMap((branding: UiBranding) => this.setBranding( {
                    ...branding,
                    selectedTheme: theme
                }, tenant).pipe(take(1)))
            );
    }

    registerTheme(newTheme: UiTheme, file: File) {
        return this.client
            .createSync(`${THEMES_BASE_URL}`, newTheme)
            .pipe(
                take(1),
                switchMap((theme: UiTheme) => this.client.startTransfer(`${THEMES_BASE_URL}/${theme.name}/contents`, {
                    "fileName": file.name,
                    "size": file.size,
                })),
                switchMap((vcdTransferClient: VcdTransferClient) => vcdTransferClient.upload(file)),
                catchError((error: ErrorType) => Observable.throw(error.message))
            );
    }

    renameTheme(themeName: string, newUITheme: UiTheme) {
        return this.client
            .updateSync<UiTheme>(`${THEMES_BASE_URL}/${themeName}`, newUITheme)
            .pipe(
                take(1),
                catchError((error) => Observable.throw(error))
            );
    };

    removeTheme(themeName: string) {
        return this.client
            .deleteSync(`${THEMES_BASE_URL}/${themeName}`)
            .pipe(
                take(1),
                catchError((error) => Observable.throw(error))
            );
    };
}
