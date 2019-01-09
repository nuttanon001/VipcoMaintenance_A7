// angular core
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// 3rd party
import "rxjs/Rx";
import "hammerjs";
// services
import { DialogsService } from "./shared/dialogs.service";
// modules
import { CustomMaterialModule } from "../shared/customer-material/customer-material.module";
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

@NgModule({
  imports: [
    // angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // customer Module
    SharedModule,
    CustomMaterialModule,
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
    ItemMaintenViewDialogComponent
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
    ItemMaintenViewDialogComponent
  ],
})
export class DialogsModule { }
