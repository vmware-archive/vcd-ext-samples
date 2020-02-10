import { Component, OnInit, Inject } from '@angular/core';
import { CONTAINER_BRANDING, Branding } from '../environments/branding';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(@Inject(CONTAINER_BRANDING) private branding: Branding) {}

  ngOnInit(): void {}
}
