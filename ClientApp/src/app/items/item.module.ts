// Angular Core
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";
// Module
import { ItemRoutingModule } from './item-routing.module';
import { CustomMaterialModule } from '../shared/customer-material/customer-material.module';
// Service
import { BranchService } from '../branchs/shared/branch.service';
import { ItemTypeService } from '../item-types/shared/item-type.service';
import { ItemService, ItemCommunicateService, ItemByGroupCommunicateService } from '../items/shared/item.service';
// Component
import { ItemMasterComponent } from './item-master/item-master.component';
import { ItemViewComponent } from './item-view/item-view.component';
import { ItemEditComponent } from './item-edit/item-edit.component';
import { ItemCenterComponent } from './item-center.component';
import { ItemTableComponent } from './item-table/item-table.component';
import { ItemByGroupDetailTableComponent } from './item-by-group-detail-table/item-by-group-detail-table.component';
import { ItemByGroupMasterComponent } from './item-by-group-master/item-by-group-master.component';
import { ItemByGroupDetailComponent } from './item-by-group-detail/item-by-group-detail.component';
import { ItemByGroupTableComponent } from './item-by-group-table/item-by-group-table.component';
import { EmployeeGroupMisService } from '../employees/shared/employee-group-mis.service';
import { ItemHistoriesComponent } from './item-histories/item-histories.component';
import { ItemHistoriesTableComponent } from './item-histories-table/item-histories-table.component';
import { ItemMasterListComponent } from './item-master-list/item-master-list.component';


@NgModule({
  imports: [
    CommonModule,
    ItemRoutingModule,
    ReactiveFormsModule,
    CustomMaterialModule
  ],
  declarations: [
    ItemMasterComponent,
    ItemViewComponent,
    ItemEditComponent,
    ItemCenterComponent,
    ItemTableComponent,
    ItemByGroupDetailTableComponent,
    ItemByGroupMasterComponent,
    ItemByGroupDetailComponent,
    ItemByGroupTableComponent,
    ItemHistoriesComponent,
    ItemHistoriesTableComponent,
    ItemMasterListComponent
  ],
  providers: [
    ItemService,
    ItemTypeService,
    BranchService,
    ItemCommunicateService,
    ItemByGroupCommunicateService,
    EmployeeGroupMisService,
  ]
})
export class ItemModule { }
