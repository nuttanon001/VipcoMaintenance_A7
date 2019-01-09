// Angular Core
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
// Module
import { WorkGroupRoutingModule } from './work-group-routing.module';
import { CustomMaterialModule } from "../shared/customer-material/customer-material.module";
// Service
import { WorkGroupService,WorkGroupCommunicateService } from './shared/work-group.service';
// Component
import { WorkGroupMasterComponent } from './work-group-master/work-group-master.component';
import { WorkGroupViewComponent } from './work-group-view/work-group-view.component';
import { WorkGroupEditComponent } from './work-group-edit/work-group-edit.component';
import { WorkGroupCenterComponent } from './work-group-center.component';
import { WorkGroupTableComponent } from './work-group-table/work-group-table.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    WorkGroupRoutingModule
  ],
  declarations: [
    WorkGroupMasterComponent,
    WorkGroupViewComponent,
    WorkGroupEditComponent,
    WorkGroupCenterComponent,
    WorkGroupTableComponent
  ],
  providers: [
    WorkGroupService,
    WorkGroupCommunicateService
  ]
})
export class WorkGroupModule { }
