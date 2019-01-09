import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemMaintenEmployeeTableComponent } from '../item-maintenances/item-mainten-employee-table/item-mainten-employee-table.component';
import { ItemMaintenHasRequireComponent } from '../item-maintenances/shared/item-mainten-has-require.component';
import { CustomMaterialModule } from './customer-material/customer-material.module';
import { ItemMaintenRequisitionTableComponent } from '../item-maintenances/item-mainten-requisition-table/item-mainten-requisition-table.component';

@NgModule({
  imports: [
    CommonModule,
    CustomMaterialModule,
  ],
  declarations: [
    ItemMaintenEmployeeTableComponent,
    ItemMaintenHasRequireComponent,
    ItemMaintenRequisitionTableComponent,
  ],
  exports: [
    ItemMaintenEmployeeTableComponent,
    ItemMaintenHasRequireComponent,
    ItemMaintenRequisitionTableComponent,
  ],
  entryComponents: [
    ItemMaintenEmployeeTableComponent,
    ItemMaintenHasRequireComponent,
    ItemMaintenRequisitionTableComponent,
  ]
})
export class SharedModule { }
