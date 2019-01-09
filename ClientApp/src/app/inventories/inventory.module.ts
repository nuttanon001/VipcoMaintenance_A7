import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoriyRoutingModule } from './inventory-routing.module';
import { ReceiveStockService, ReceiveStockCommunicateService } from '../inventories/shared/receive-stock.service';
import { RequisitionStockService } from '../inventories/shared/requisition-stock.service';
import { MovementStockService } from './shared/movement-stock.service';
import { InventoryCenterComponent } from './inventory-center.component';
import { ReceiveMasterComponent } from './receive-master/receive-master.component';
import { ReceiveTableComponent } from './receive-table/receive-table.component';
import { ReceiveViewComponent } from './receive-view/receive-view.component';
import { ReceiveEditComponent } from './receive-edit/receive-edit.component';
import { RequisitionMasterComponent } from './requisition-master/requisition-master.component';
import { RequisitionTableComponent } from './requisition-table/requisition-table.component';
import { RequisitionViewComponent } from './requisition-view/requisition-view.component';
import { RequisitionEditComponent } from './requisition-edit/requisition-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from '../shared/customer-material/customer-material.module';
import { AdjustStockService, AdjustStockCommunicateService } from './shared/adjust-stock.service';
import { AdjustViewComponent } from './adjust-view/adjust-view.component';
import { AdjustEditComponent } from './adjust-edit/adjust-edit.component';
import { AdjustMasterComponent } from './adjust-master/adjust-master.component';
import { AdjustTableComponent } from './adjust-table/adjust-table.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    InventoriyRoutingModule
  ],
  declarations: [
    InventoryCenterComponent,
    ReceiveMasterComponent,
    ReceiveTableComponent,
    ReceiveViewComponent,
    ReceiveEditComponent,
    RequisitionMasterComponent,
    RequisitionTableComponent,
    RequisitionViewComponent,
    RequisitionEditComponent,
    AdjustViewComponent,
    AdjustEditComponent,
    AdjustMasterComponent,
    AdjustTableComponent
  ],
  providers: [
    ReceiveStockService,
    ReceiveStockCommunicateService,
    RequisitionStockService,
    MovementStockService,
    AdjustStockService,
    AdjustStockCommunicateService,
  ]
})
export class InventoriyModule { }
