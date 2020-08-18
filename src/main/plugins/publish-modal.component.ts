import {Component, EventEmitter, Output, ViewChild} from "@angular/core";
import {PublishPluginsOperationSpec} from "./plugin-operations.model";
import {PluginSpec} from "./plugin.model";
import {PublishFormComponent} from "./publish-form.component";

@Component({
    selector: "vcd-ext-publish-modal",
    templateUrl: "./publish-modal.component.html",
    styleUrls: ["./publish-modal.component.scss"]
})
export class PublishModalComponent {

    plugins: PluginSpec[] = [];
    opened = false;

    @Output()
    published = new EventEmitter<PublishPluginsOperationSpec>();

    @ViewChild(PublishFormComponent)
    publishForm: PublishFormComponent;

    constructor() {
    }

    get canSave() {
        return !this.loading && this.publishForm && this.publishForm.dirty;
    }

    get loading() {
        if (!this.publishForm) {
            return true;
        }

        return this.publishForm.loading;
    }

    open(plugins: PluginSpec[]) {
        this.plugins = plugins;
        this.publishForm.reset(plugins);
        this.opened = true;
    }

    onCancelClick() {
        this.opened = false;
    }

    onSaveClick() {
        this.publishForm.publish();
    }

    onPublishFormPublished(event: PublishPluginsOperationSpec) {
        this.opened = false;
        this.published.emit(event);
    }
}