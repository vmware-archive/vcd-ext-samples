import { Component } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { EntityActionExtensionComponent, EntityActionExtensionMenuEntry } from "@vcd/sdk/common";

@Component({
    selector: 'vapp-restore-action-extension',
    templateUrl: './vapp.restore.action.component.html'
})
export class VappRestoreActionComponent extends EntityActionExtensionComponent {
    modalText = "";
    opened = false;

    private result: Subject<{ refreshRequested: boolean }>;

    getMenuEntry(entityUrn: string): Observable<EntityActionExtensionMenuEntry> {
        return Observable.of({
            text: "Restore",
            children: [{
                urn: "urn:vmware:vcloud:vapp:restore",
                text: "Restore VMs...",
                busy: false,
                enabled: true
            },
            {
                urn: "urn:vmware:vcloud:vapp:restoreAll",
                text: "Restore All VMs",
                busy: false,
                enabled: false
            },
            {
                urn: "urn:vmware:vcloud:vapp:viewSnaphots",
                text: "View Restore Points...",
                busy: false,
                enabled: true
            }]
        });
    }

    performAction(menuItemUrn: string, entityUrn: string): Observable<{ refreshRequested: boolean }> {
        this.modalText = `Entity: ${entityUrn}  Action: ${menuItemUrn}`;
        this.opened = true;
        this.result = new Subject<{ refreshRequested: boolean }>();
        return this.result.asObservable();
    }

    onClose() {
        this.opened = false;
        this.result.next({ refreshRequested: true });
        this.result.complete();
    }

}