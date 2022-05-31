// angular core
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// 3rd party
import "hammerjs";
// services
import { DialogsService } from "./shared/dialogs.service";
// modules
import { CustomMaterialModule } from "../shared/customer-material/customer-material.module";
import { CustomMaterialModule as CustomMaterialAlias } from "../shared2/customer-material.module";
import { SharedModule as SharedModuleAlias } from "../shared2/shared.module";
// components
import {
  ConfirmDialog, ContextDialog,
  ErrorDialog, EmployeeDialogComponent,
  GroupmisDialogComponent, ItemDialogComponent,
  ProjectDialogComponent,
  ItemTableDialogComponent, EmployeeTableComponent,
  GroupmisTableComponent, ProjectTableComponent,
  RequireMaintenDialogComponent,RequireMaintenViewDialogComponent
} from "./dialog.index";
import { SparePartDialogComponent } from './spare-part-dialog/spare-part-dialog.component';
import { SparePartTableDialogComponent } from './spare-part-dialog/spare-part-table-dialog.component';
import { ItemMaintenDialogComponent } from './item-mainten-dialog/item-mainten-dialog.component';
import { ItemMaintenViewDialogComponent } from './item-mainten-dialog/item-mainten-view-dialog.component';
import { ItemMaintenModule } from "../item-maintenances/item-mainten.module";
import { SharedModule } from "../shared/shared.module";
import { ObsoleteItemDialogComponent } from './obsolete-item-dialog/obsolete-item-dialog.component';
import { ObsoleteItemInfoDialogComponent } from './obsolete-item-dialog/obsolete-item-info-dialog/obsolete-item-info-dialog.component';
import { ItemMk2DialogComponent } from './item-mk2-dialog/item-mk2-dialog.component';
import { ItemMk2TableComponent } from './item-mk2-dialog/item-mk2-table/item-mk2-table.component';
import { ItemHistoriesDialogComponent } from './obsolete-item-dialog/item-histories-dialog/item-histories-dialog.component';

@NgModule({
  imports: [
    // angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // customer Module
    SharedModule,
    SharedModuleAlias,
    CustomMaterialModule,
    CustomMaterialAlias,
  ],
  declarations: [
    ErrorDialog,
    ConfirmDialog,
    ContextDialog,
    EmployeeDialogComponent,
    EmployeeTableComponent,
    ProjectDialogComponent,
    ProjectTableComponent,
    ItemDialogComponent,
    //WorkgroupDialogComponent,
    GroupmisDialogComponent,
    GroupmisTableComponent,
    ItemTableDialogComponent,
    RequireMaintenDialogComponent,
    RequireMaintenViewDialogComponent,
    SparePartDialogComponent,
    SparePartTableDialogComponent,
    ItemMaintenDialogComponent,
    ItemMaintenViewDialogComponent,
    ObsoleteItemDialogComponent,
    ObsoleteItemInfoDialogComponent,
    ItemHistoriesDialogComponent,
    ItemMk2DialogComponent,
    ItemMk2TableComponent,
  ],
  providers: [
    DialogsService,
  ],
  // a list of components that are not referenced in a reachable component template.
  // doc url is :https://angular.io/guide/ngmodule-faq
  entryComponents: [
    ErrorDialog,
    ConfirmDialog,
    ContextDialog,
    ProjectDialogComponent,
    EmployeeDialogComponent,
    //WorkgroupDialogComponent,
    ItemDialogComponent,
    ItemTableDialogComponent,
    GroupmisDialogComponent,
    GroupmisTableComponent,
    RequireMaintenDialogComponent,
    RequireMaintenViewDialogComponent,
    SparePartDialogComponent,
    SparePartTableDialogComponent,
    ItemMaintenDialogComponent,
    ItemMaintenViewDialogComponent,
    ObsoleteItemDialogComponent,
    ObsoleteItemInfoDialogComponent,
    ItemHistoriesDialogComponent,
    ItemMk2DialogComponent,
    ItemMk2TableComponent
  ],
})
export class DialogsModule { }
