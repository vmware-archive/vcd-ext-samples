import { InjectionToken } from "@angular/core";

export const API_ROOT_URL = new InjectionToken("API_ROOT_URL");
export const EXTENSION_ASSET_URL = new InjectionToken("EXTENSION_ASSET_URL");
export const EXTENSION_ROUTE = new InjectionToken("EXTENSION_ROUTE");
export class AuthTokenHolderService {
    token: string;
}
export class ExtensionNavRegistrationAction {
    type: string;
    constructor(extension: any) {
        this.type = "ExtensionNavRegistrationAction";
    }
}