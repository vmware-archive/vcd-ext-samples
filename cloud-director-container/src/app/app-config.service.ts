import { Injectable, Injector, NgModuleFactoryLoader, Inject, Optional, ReflectiveInjector } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { SessionType } from '@vcd/bindings/vcloud/api/rest/schema_v1_5';
import { CONTAINER_CREDENTIALS, Credentials, UserCredentials, TokenCredentials } from 'src/environments/access';
import { PluginRegistration } from 'src/plugins';
import { Router } from '@angular/router';
import { EXTENSION_ASSET_URL, EXTENSION_ROUTE, AuthTokenHolderService } from 'src/environments/container-registrations';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  constructor(private injector: Injector,
    private loader: NgModuleFactoryLoader,
    private http: HttpClient,
    @Inject(CONTAINER_CREDENTIALS) @Optional() private credentials: Credentials) {

  }

  login(): Promise<string> {
    if (!this.credentials) {
      console.group("(authentication)");
      console.log("No credentials provided. Authentication skipped.");
      console.groupEnd();
      return Promise.resolve("");
    }

    if (this.isTokenCredentials(this.credentials)) {
      console.group("(authentication)");
      console.log("Token credentials provided. Session creation skipped.");
      console.groupEnd();
      return Promise.resolve(this.credentials.token);
    }

    const auth: string = btoa(`${this.credentials.username}@${this.credentials.tenant}:${this.credentials.password}`);
    console.group("(authentication)");
    console.log("Authenticating user", this.credentials.username);
    console.groupEnd();
    return this.http.post("api/sessions", null, {
      observe: "response",
      headers: { "Authorization": `Basic ${auth}`, "Accept": "application/*+json;version=34.0", "Content-Type": "application/*+json" }
    }).toPromise().then((response: HttpResponse<SessionType>) => {
      return `${response.headers.get('x-vmware-vcloud-token-type')} ${response.headers.get('x-vmware-vcloud-access-token')}`;
    });
  }

  loadPlugin(plugin: PluginRegistration, authToken: string): Promise<void> {
    return this.loader.load(`${plugin.root}/${plugin.module}`).then(moduleFactory => {
      console.group(`(plugin registration: ${plugin.path})`)
      console.log("Plugin loaded");
      const moduleInjector: Injector = ReflectiveInjector.resolveAndCreate([
        { provide: EXTENSION_ASSET_URL, useValue: `${plugin.root}/public/assets` },
        { provide: EXTENSION_ROUTE, useValue: plugin.path },
        { provide: AuthTokenHolderService, useValue: { token: authToken } }
      ], this.injector);
      const module = moduleFactory.create(moduleInjector);
      console.log("Module created");

      // Overwrite the create method to return the singleton.
      moduleFactory.create = () => module;

      let router: Router = this.injector.get(Router);
      router.config.push({ path: plugin.path, loadChildren: () => moduleFactory });
      console.log("Routes registered");
      console.groupEnd();
    })
  }

  configureRoutes(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      console.group("(routing)")
      let router: Router = this.injector.get(Router);
      router.resetConfig(router.config);
      console.log("Updated router configuration");
      console.groupEnd();

      resolve(true);
    })
  }

  private isTokenCredentials(credentials: Credentials): credentials is TokenCredentials {
    return (credentials as TokenCredentials).token !== undefined;
  }

  private isUserCredentials(credentials: Credentials): credentials is UserCredentials {
    return (credentials as UserCredentials).username !== undefined;
  }
}
