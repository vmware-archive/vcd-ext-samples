import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";

@Component({
    selector: "datacenter-compute",
    templateUrl: "./datacenter-compute.component.html",
    host: {'class': 'content-container'}
})
export class DatacenterComputeComponent implements OnInit {
    username: Observable<string>;
    tenant: Observable<string>;

    constructor() {}

    ngOnInit(): void {}
}
