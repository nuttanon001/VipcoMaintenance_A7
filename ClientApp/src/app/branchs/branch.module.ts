// AngulerCore
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule } from "@angular/forms";
// Modules
import { CustomMaterialModule } from "../shared/customer-material/customer-material.module";
import { BranchRoutingModule } from "./branch-routing.module";
// Services
import { BranchService,BranchCommunicateService } from './shared/branch.service';
// Components
import { BranchCenterComponent } from "./branch-center.component";
import { BranchMasterComponent } from './branch-master/branch-master.component';
import { BranchViewComponent } from './branch-view/branch-view.component';
import { BranchEditComponent } from './branch-edit/branch-edit.component';
import { BranchTableComponent } from './branch-table/branch-table.component';

@NgModule({
  imports: [
    CommonModule,
    BranchRoutingModule,
    CustomMaterialModule,
    ReactiveFormsModule
  ],
  declarations: [
    BranchMasterComponent,
    BranchViewComponent,
    BranchEditComponent,
    BranchCenterComponent,
    BranchTableComponent
  ],
  providers: [
    BranchService,
    BranchCommunicateService
  ]
})
export class BranchModule { }
