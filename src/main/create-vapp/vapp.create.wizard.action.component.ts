import { Component } from "@angular/core";
import { WizardExtensionComponent } from "@vcd/sdk/common";

@Component({
    selector: 'vapp-create-extension',
    templateUrl: './vapp.create.wizard.action.component.html'
})
export class VappCreateWizardExtensionPointComponent extends WizardExtensionComponent<any, any, any> {
    performAction(payoad: string, returnValue: string, error: any) {
        console.log("[vApp Create Wizard Extension Point]", payoad, returnValue, error);
    }
}