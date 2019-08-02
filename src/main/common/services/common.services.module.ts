import { NgModule } from "@angular/core";

import { BrandingService } from "./branding.service";
import {OrganizationService} from "./organization.service";

@NgModule({
    providers: [
        BrandingService,
        OrganizationService
    ]
})
export class VcdCommonServicesModule {}
