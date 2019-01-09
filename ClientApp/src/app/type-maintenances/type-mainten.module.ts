// Angular Core
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Components
import { TypeMaintenRoutingModule } from './type-mainten-routing.module';
import { TypeMaintenCenterComponent } from './type-mainten-center.component';
import { TypeMaintenViewComponent } from './type-mainten-view/type-mainten-view.component';
import { TypeMaintenMasterComponent } from './type-mainten-master/type-mainten-master.component';
import { TypeMaintenEditComponent } from './type-mainten-edit/type-mainten-edit.component';
import { TypeMaintenTableComponent } from './type-mainten-table/type-mainten-table.component';
// Services
import { ItemTypeService } from '../item-types/shared/item-type.service';
import { TypeMaintenService, TypeMaintenCommunicateService } from './shared/type-mainten.service';
// Modules
import { CustomMaterialModule } from "../shared/customer-material/customer-material.module";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    TypeMaintenRoutingModule
  ],
  declarations: [
    TypeMaintenCenterComponent,
    TypeMaintenViewComponent,
    TypeMaintenMasterComponent,
    TypeMaintenEditComponent,
    TypeMaintenTableComponent],
  providers: [
    ItemTypeService,
    TypeMaintenService,
    TypeMaintenCommunicateService,
  ]
})
export class TypeMaintenModule { }
