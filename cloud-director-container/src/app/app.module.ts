import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from 'clarity-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { CONTAINER_BRANDING } from '../environments/branding';
import { StoreModule } from '@ngrx/store';
import { PLUGINS } from 'src/plugins';
import { API_ROOT_URL } from 'src/environments/container-registrations';
import { AppConfigService } from './app-config.service';
import { HttpClientModule } from '@angular/common/http';
import { CONTAINER_CREDENTIALS, Credentials } from 'src/environments/access';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClarityModule,
    HttpClientModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({})
  ],
  providers: [
    { provide: CONTAINER_BRANDING, useValue: environment["branding"] },
    { provide: CONTAINER_CREDENTIALS, useValue: environment["credentials"] },
    { provide: API_ROOT_URL, useValue: "" },
    { provide: APP_INITIALIZER, useFactory: bootstrapApplication, multi: true, deps: [AppConfigService] },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

export function bootstrapApplication(appConfig: AppConfigService): () => Promise<boolean> {
  return () => new Promise<boolean>(resolve => {
    console.group("[application bootstrap]")
    appConfig.login().then(authToken => {
      let loaders: Promise<any>[] = [];
      PLUGINS.forEach(plugin => {
        loaders.push(appConfig.loadPlugin(plugin, authToken));
      });
      Promise.all(loaders).then(() => appConfig.configureRoutes()).then(() => {
        console.groupEnd();
        resolve(true)
      })
    })
  });
}
