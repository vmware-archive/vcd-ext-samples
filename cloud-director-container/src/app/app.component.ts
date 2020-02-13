import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { CONTAINER_BRANDING, Branding } from '../environments/branding';
import { Title } from '@angular/platform-browser';
import { PluginRegistration, PLUGINS } from 'src/plugins';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private routerEventsSubscription: Subscription;

  private _pluginRegistrations: PluginRegistration[] = [];
  get pluginRegistrations(): PluginRegistration[] {
    return this._pluginRegistrations;
  }

  private _activePlugin: PluginRegistration;
  get activePlugin(): PluginRegistration {
    return this._activePlugin;
  }

  constructor(@Inject(CONTAINER_BRANDING) private branding: Branding, private title: Title, private router: Router) {
    this._pluginRegistrations = PLUGINS;
  }

  ngOnInit(): void {
    this.title.setTitle(this.branding.headerTitle);

    this.routerEventsSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setPluginContext();
      }
    })
  }

  ngOnDestroy(): void {
    this.routerEventsSubscription.unsubscribe();
  }

  private setPluginContext(): void {
    for (let index = 0; index < this._pluginRegistrations.length; index++) {
      if (this.router.isActive(this._pluginRegistrations[index].path, false)) {
        this._activePlugin = this._pluginRegistrations[index];
        break;
      }
    }
  }
}
