import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";

@Component({
    selector: "datacenter-storage",
    templateUrl: "./datacenter-storage.component.html",
    host: {'class': 'content-container'}
})
export class DatacenterStorageComponent implements OnInit {
    username: Observable<string>;
    tenant: Observable<string>;

    constructor() {}

    ngOnInit(): void {}
}
