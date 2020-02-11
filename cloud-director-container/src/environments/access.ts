import { InjectionToken } from "@angular/core";

export class UserCredentials {
    username: string;
    tenant: string;
    password: string;
}

export class TokenCredentials {
    token: string;
}

export type Credentials = UserCredentials | TokenCredentials;

export const CONTAINER_CREDENTIALS = new InjectionToken<Credentials>("VCD authentication credentials");