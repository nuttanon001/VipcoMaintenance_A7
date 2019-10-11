// Angular Core
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Components
import { ObsoleteItemCenterComponent } from './obsolete-item-center.component';
import { ObsoleteItemInfoComponent } from './obsolete-item-info/obsolete-item-info.component';
import { ObsoleteItemMasterComponent } from './obsolete-item-master/obsolete-item-master.component';
import { ObsoleteItemScheduleComponent } from './obsolete-item-schedule/obsolete-item-schedule.component';
// Modules
import { SharedModule } from '../shared2/shared.module';
import { ObsoleteItemRoutingModule } from './obsolete-item-routing.module';
import { CustomMaterialModule } from '../shared2/customer-material.module';
// Services
import { ObsoleteItemCommunicateService } from './shared/obsolete-item-communicate.service';
import { ItemService } from '../items/shared/item.service';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    ObsoleteItemRoutingModule
  ],
  declarations: [
    ObsoleteItemInfoComponent,
    ObsoleteItemCenterComponent,
    ObsoleteItemMasterComponent,
    ObsoleteItemScheduleComponent,
  ],
  providers: [
    ItemService,
    ObsoleteItemCommunicateService
  ]
})
export class ObsoleteItemModule { }
