import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";
// module
import { CustomMaterialModule } from "../shared/customer-material/customer-material.module";
import { ItemTypeRoutingModule } from './item-type-routing.module';
import { ItemTypeService, ItemTypeCommunicateService } from "./shared/item-type.service";
// component
import { ItemTypeMasterComponent } from './item-type-master/item-type-master.component';
import { ItemTypeViewComponent } from './item-type-view/item-type-view.component';
import { ItemTypeEditComponent } from './item-type-edit/item-type-edit.component';
import { ItemTypeCenterComponent } from './item-type-center.component';
import { ItemTypeTableComponent } from './item-type-table/item-type-table.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    ItemTypeRoutingModule
  ],
  declarations: [
    ItemTypeMasterComponent,
    ItemTypeViewComponent,
    ItemTypeEditComponent,
    ItemTypeCenterComponent,
    ItemTypeTableComponent
  ],
  providers: [
    ItemTypeService,
    ItemTypeCommunicateService
  ]
})
export class ItemTypeModule { }
