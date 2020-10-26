import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";

@Component({
    selector: "application",
    templateUrl: "./application.component.html",
    host: {'class': 'content-container'}
})
export class ApplicationComponent implements OnInit {
    username: Observable<string>;
    tenant: Observable<string>;

    constructor() {}

    ngOnInit(): void {}
}
