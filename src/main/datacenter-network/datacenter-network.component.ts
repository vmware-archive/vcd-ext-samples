import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";

@Component({
    selector: "datacenter-network",
    templateUrl: "./datacenter-network.component.html",
    host: {'class': 'content-container'}
})
export class DatacenterNetworkComponent implements OnInit {
    username: Observable<string>;
    tenant: Observable<string>;

    constructor() {}

    ngOnInit(): void {}
}
