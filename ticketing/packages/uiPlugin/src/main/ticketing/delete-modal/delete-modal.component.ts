import {Component, OnInit} from "@angular/core";

export interface DeleteModalConfig<T> {
    header: string;
    body: string;
    deleteHandler: Function;
    payload?: T;
}

@Component({
    selector: "delete-modal",
    templateUrl: "./delete-modal.component.html",
    styleUrls: ["./delete-modal.component.scss"]
})
export class DeleteModalComponent implements OnInit {

    public opened = false;
    public config: DeleteModalConfig<any> = null;

    constructor() {
    }

    ngOnInit(): void {
    }

    public open<T>(modalConfig: DeleteModalConfig<T>){
        this.config = modalConfig;
        this.opened = true;
    }

    public onCancel(){
        this.opened = false;
    }

    public onDelete(){
        this.opened = false;
        this.config.deleteHandler(this.config.payload);
    }

}
