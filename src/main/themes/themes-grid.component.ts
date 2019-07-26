import {Component, EventEmitter, Input, Output} from "@angular/core";
import {UiTheme} from "@vcd/bindings/vcloud/rest/openapi/model";
import {SortOrder} from "../common/sortOrder";
import {ObjectHelper} from "../common/utils";

export enum ThemeType {
    BUILT_IN = "Built In",
    CUSTOM = "Custom"
}

@Component({
    selector: "vcd-ext-themes-grid",
    templateUrl: "./themes-grid.component.html",
    styleUrls: ["./themes-grid.component.scss"]
})
export class ThemesGridComponent {
    readonly sortOrder = SortOrder.Asc;
    readonly themeType = ThemeType;

    selectedTheme: UiTheme;

    @Input() hideAction = false;
    @Input() isLoading = true;
    @Input() themes: UiTheme[] = [];

    @Output() themesRefresh = new EventEmitter();
    @Output() registerTheme = new EventEmitter();
    @Output() publishTheme = new EventEmitter<UiTheme>();
    @Output() renameTheme = new EventEmitter<UiTheme>();
    @Output() removeTheme = new EventEmitter<UiTheme>();

    openPublishModal() {
        this.publishTheme.emit(ObjectHelper.clone(this.selectedTheme));
    }

    openRegisterModal() {
        this.registerTheme.emit();
    }

    openRenameModal() {
        this.renameTheme.emit(ObjectHelper.clone(this.selectedTheme));
    }

    openRemoveModal() {
        this.removeTheme.emit(ObjectHelper.clone(this.selectedTheme));
    }

    refreshThemes() {
        this.themesRefresh.emit();
    }
}
