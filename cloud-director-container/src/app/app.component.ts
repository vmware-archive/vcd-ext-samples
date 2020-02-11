import { Component, OnInit, Inject } from '@angular/core';
import { CONTAINER_BRANDING, Branding } from '../environments/branding';
import { Title } from '@angular/platform-browser';
import { PluginRegistration, PLUGINS } from 'src/plugins';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private _pluginRegistrations: PluginRegistration[] = [];
  get pluginRegistrations(): PluginRegistration[] {
    return this._pluginRegistrations;
  }

  constructor(@Inject(CONTAINER_BRANDING) private branding: Branding, private title: Title) {
    this._pluginRegistrations = PLUGINS;
  }

  ngOnInit(): void {
    this.title.setTitle(this.branding.headerTitle);
  }
}
