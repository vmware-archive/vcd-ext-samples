import { Injectable } from "@angular/core";

import {Observable} from "rxjs";

import {UiBranding, UiTheme} from "@vcd/bindings/vcloud/rest/openapi/model";

import {VcdApiClient} from "@vcd/sdk";
import {TransferResult, VcdTransferClient} from "@vcd/sdk/client/vcd.transfer.client";
import {catchError, map, switchMap, take} from "rxjs/operators";

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

    uploadThemeContent(theme: UiTheme, file: File): Observable<TransferResult> {
        return this.client.startTransfer(`${THEMES_BASE_URL}/${theme.name}/contents`, {
                "fileName": file.name,
                "size": file.size,
            })
            .pipe(
                switchMap((vcdTransferClient: VcdTransferClient) => vcdTransferClient.upload(file))
            );
    }

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
                    catchError((error) => Observable.throw(error.error || error))
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

    registerTheme(newTheme: UiTheme, file: File): Observable<UiTheme> {
        return this.client
            .createSync(`${THEMES_BASE_URL}`, newTheme)
            .pipe(
                take(1),
                switchMap((theme: UiTheme) => this.uploadThemeContent(theme, file).pipe(map(() => theme))),
                catchError((error) => Observable.throw(error.error || error))
            );
    }

    update(themeName: string, newUITheme: UiTheme, file?: File): Observable<UiTheme> {
        return this.client
            .updateSync<UiTheme>(`${THEMES_BASE_URL}/${themeName}`, newUITheme)
            .pipe(
                take(1),
                switchMap((uiTheme: UiTheme) => {
                    if (file) {
                        return this.uploadThemeContent(uiTheme, file).pipe(map(() => uiTheme));
                    } else {
                        return Observable.of(uiTheme);
                    }
                }),
                catchError((error) => Observable.throw(error.error || error))
            );
    };

    removeTheme(themeName: string) {
        return this.client
            .deleteSync(`${THEMES_BASE_URL}/${themeName}`)
            .pipe(
                take(1),
                catchError((error) => Observable.throw(error.error || error))
            );
    };
}
