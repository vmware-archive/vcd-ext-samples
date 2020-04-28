import { Component } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { EntityActionExtensionComponent, EntityActionExtensionMenuEntry } from "@vcd/sdk/common";

@Component({
    selector: 'vm-backup-action-extension',
    templateUrl: './vm.backup.action.component.html'
})
export class VmBackupActionComponent extends EntityActionExtensionComponent {
    modalText = "";
    opened = false;

    private result: Subject<{ refreshRequested: boolean }>;

    getMenuEntry(entityUrn: string): Observable<EntityActionExtensionMenuEntry> {
        return Observable.of({
            text: "Backup",
            children: [{
                urn: "urn:vmware:vcloud:vm:backup",
                text: "Backup",
                busy: false,
                enabled: true
            },
            {
                urn: "urn:vmware:vcloud:vm:deleteBackup",
                text: "Delete Backups",
                busy: false,
                enabled: false
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