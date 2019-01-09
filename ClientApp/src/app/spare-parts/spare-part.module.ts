import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// Modules
import { CustomMaterialModule } from "../shared/customer-material/customer-material.module";
import { SparePartRoutingModule } from './spare-part-routing.module';
// Services
import { SparePartService, SparePartCommunicateService } from './shared/spare-part.service';
// Components
import { SparePartMasterComponent } from './spare-part-master/spare-part-master.component';
import { SparePartViewComponent } from './spare-part-view/spare-part-view.component';
import { SparePartEditComponent } from './spare-part-edit/spare-part-edit.component';
import { SparePartTableComponent } from './spare-part-table/spare-part-table.component';
import { SparePartCenterComponent } from './spare-part-center.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    SparePartRoutingModule
  ],
  declarations: [
    SparePartMasterComponent,
    SparePartViewComponent,
    SparePartEditComponent,
    SparePartTableComponent,
    SparePartCenterComponent
  ],
  providers: [
    SparePartService,
    SparePartCommunicateService
  ]
})
export class SparePartModule { }
