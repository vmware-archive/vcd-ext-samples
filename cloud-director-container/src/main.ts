import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

console.group("[systemjs configuration]");
const System = window["System"];

import * as containerRegistrations from './environments/container-registrations';
System.registry.set("@vcd/common", System.newModule(containerRegistrations));
console.debug("Added @vcd/common package to SystemJS registry");

import * as rxjsCompat from 'rxjs-compat';
System.registry.set("rxjs", System.newModule(rxjsCompat));
console.debug("Added rxjs-compat to SystemJS registry");
console.groupEnd();

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

