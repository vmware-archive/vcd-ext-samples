import { Component } from "@angular/core";
import { WizardExtensionComponent } from "@vcd/sdk/common";

@Component({
    selector: 'vm-create-extension',
    templateUrl: './vm.create.wizard.action.component.html'
})
export class VmCreateWizardExtensionPointComponent extends WizardExtensionComponent<any, any, any> {
    performAction(payoad: string, returnValue: string, error: any) {
        console.log("[VM Create Wizard Extension Point]", payoad, returnValue, error);
    }
}