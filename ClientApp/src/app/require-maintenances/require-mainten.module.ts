// Angular Core
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// Modules
import { RequireMaintenRoutingModule } from './require-mainten-routing.module';
import { CustomMaterialModule } from "../shared/customer-material/customer-material.module";
// Services
import {
  RequireMaintenService,
  RequireMaintenCommunicateService
} from './shared/require-mainten.service';
// Components
import {
  RequireMaintenCenterComponent
} from './require-mainten-center.component';
import {
  RequireMaintenViewComponent
} from './require-mainten-view/require-mainten-view.component';
import {
  RequireMaintenMasterComponent
} from './require-mainten-master/require-mainten-master.component';
import {
  RequireMaintenEditComponent
} from './require-mainten-edit/require-mainten-edit.component';
import {
  RequireMaintenTableComponent
} from './require-mainten-table/require-mainten-table.component';
import {
  RequireMaintenScheduleComponent
} from './require-mainten-schedule/require-mainten-schedule.component';
import { EmployeeGroupMisService } from '../employees/shared/employee-group-mis.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    RequireMaintenRoutingModule
  ],
  declarations: [
    RequireMaintenCenterComponent,
    RequireMaintenViewComponent,
    RequireMaintenMasterComponent,
    RequireMaintenEditComponent,
    RequireMaintenTableComponent,
    RequireMaintenScheduleComponent
  ],
  providers: [
    RequireMaintenService,
    RequireMaintenCommunicateService,
    EmployeeGroupMisService,
  ]
})
export class RequireMaintenModule { }
