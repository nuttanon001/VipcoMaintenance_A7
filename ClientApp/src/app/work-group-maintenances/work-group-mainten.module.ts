import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// Module
import { CustomMaterialModule } from '../shared/customer-material/customer-material.module';
import { WorkGroupMaintenRoutingModule } from './work-group-mainten-routing.module';
// Component
import { WorkGroupMaintenCenterComponent } from './work-group-mainten-center.component';
import { WorkGroupMaintenViewComponent } from './work-group-mainten-view/work-group-mainten-view.component';
import { WorkGroupMaintenMasterComponent } from './work-group-mainten-master/work-group-mainten-master.component';
import { WorkGroupMaintenTableComponent } from './work-group-mainten-table/work-group-mainten-table.component';
import { WorkGroupMaintenEditComponent } from './work-group-mainten-edit/work-group-mainten-edit.component';
// Service
import { WorkGroupMaintenService, WorkGroupMaintenCommunicateService } from './shared/work-group-mainten.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    WorkGroupMaintenRoutingModule
  ],
  declarations: [
    WorkGroupMaintenCenterComponent,
    WorkGroupMaintenViewComponent,
    WorkGroupMaintenMasterComponent,
    WorkGroupMaintenTableComponent,
    WorkGroupMaintenEditComponent,
  ],
  providers: [
    WorkGroupMaintenService,
    WorkGroupMaintenCommunicateService,
  ]
})
export class WorkGroupMaintenModule { }
