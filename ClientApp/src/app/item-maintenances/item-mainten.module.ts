//Angular Core
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
//Modules
import { CustomMaterialModule } from '../shared/customer-material/customer-material.module';
import { ItemMaintenRoutingModule } from './item-mainten-routing.module';
import { SharedModule } from '../shared/shared.module';

//Services
import { ItemMaintenService, ItemMaintenCommunicateService } from './shared/item-mainten.service';
import { RequireMaintenService } from "../require-maintenances/shared/require-mainten.service";
import { TypeMaintenService } from '../type-maintenances/shared/type-mainten.service';
import { RequisitionStockService } from '../inventories/shared/requisition-stock.service';
import { WorkGroupMaintenService } from '../work-group-maintenances/shared/work-group-mainten.service';
//Components
import { ItemMaintenMasterComponent } from './item-mainten-master/item-mainten-master.component';
import { ItemMaintenViewComponent } from './item-mainten-view/item-mainten-view.component';
import { ItemMaintenEditComponent } from './item-mainten-edit/item-mainten-edit.component';
import { ItemMaintenTableComponent } from './item-mainten-table/item-mainten-table.component';
import { ItemMaintenCenterComponent } from './item-mainten-center.component';
import { ItemMaintenRequisitionComponent } from './item-mainten-requisition/item-mainten-requisition.component';
import { ItemMaintenHasEmpService } from './shared/item-mainten-has-emp.service';
import { ItemMaintenReportComponent } from './item-mainten-report/item-mainten-report.component';
import { ItemMaintenScheduleComponent } from './item-mainten-schedule/item-mainten-schedule.component';
import { ItemManitenLinkMailComponent } from './item-maniten-link-mail/item-maniten-link-mail.component';
import { ItemMaintenHistoryComponent } from './item-mainten-history/item-mainten-history.component';
import { ItemTypeService } from '../item-types/shared/item-type.service';
import { ItemMaintenanceListComponent } from './item-maintenance-list/item-maintenance-list.component';
// Shared
//import { ItemMaintenEmployeeTableComponent } from './item-mainten-employee-table/item-mainten-employee-table.component';
//import { ItemMaintenRequisitionTableComponent } from './item-mainten-requisition-table/item-mainten-requisition-table.component';
//import { ItemMaintenHasRequireComponent } from './shared/item-mainten-has-require.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ItemMaintenRoutingModule,
    //Customer
    CustomMaterialModule,
    SharedModule,
  ],
  declarations: [
    ItemMaintenMasterComponent,
    ItemMaintenViewComponent,
    ItemMaintenEditComponent,
    ItemMaintenTableComponent,
    ItemMaintenCenterComponent,
    ItemMaintenRequisitionComponent,
    ItemMaintenReportComponent,
    ItemMaintenScheduleComponent,
    ItemManitenLinkMailComponent,
    ItemMaintenHistoryComponent,
    ItemMaintenanceListComponent
    // Shared
    //ItemMaintenHasRequireComponent,
    //ItemMaintenRequisitionTableComponent,
    //ItemMaintenEmployeeTableComponent,
  ],
  providers: [
    ItemMaintenService,
    ItemMaintenCommunicateService,
    ItemTypeService,
    RequisitionStockService,
    RequireMaintenService,
    TypeMaintenService,
    WorkGroupMaintenService,
    ItemMaintenHasEmpService,
  ]
})
export class ItemMaintenModule { }
