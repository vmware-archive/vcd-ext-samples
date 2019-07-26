import {Component, HostBinding, Input} from "@angular/core";
import {TranslateService} from "@vcd/sdk/i18n";

export enum SPINNER_SIZE {
    SMALL = "sm",
    MEDIUM = "md",
    LARGE = "lg"
}

/**
 * Loading component that shows backdrop, spinner and loading message.
 *
 * Usage:
 *  <loading-indicator [isLoading]="isLoading" [labelKey]="labelKey">
 *      <!-- Your content goes here -->
 *  </loading-indicator>
 */
@Component({
    selector: "loading-indicator",
    templateUrl: "./loading-indicator.component.html",
    styleUrls: ["./loading-indicator.component.scss"]
})
export class LoadingIndicatorComponent {
    @HostBinding("class.vcd-ext-no-scrolling") @Input() isLoading = true;
    @Input() size: SPINNER_SIZE = SPINNER_SIZE.MEDIUM;
    @Input() labelKey = "";
}
