import { InjectionToken } from "@angular/core";

export class Branding {
    headerTitle: string;
    headerLogo?: string;
}

export const CONTAINER_BRANDING = new InjectionToken<Branding>("White labeling data");