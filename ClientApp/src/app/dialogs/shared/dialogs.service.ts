// Angular Core
import { MatDialogRef, MatDialog, MatDialogConfig } from "@angular/material";
import { Injectable, ViewContainerRef } from "@angular/core";
// rxjs
import { Observable } from "rxjs/Rx";
// components
import {
  ConfirmDialog, ContextDialog,
  ErrorDialog,
  GroupmisDialogComponent,
  EmployeeDialogComponent,
  ProjectDialogComponent,
  ItemDialogComponent,
  RequireMaintenDialogComponent
} from "../dialog.index";
// module
import { Employee } from "../../employees/shared/employee.model";
import { EmployeeGroupMis } from "../../employees/shared/employee-group-mis.model";
import { ProjectMaster } from "../../projects/shared/project-master.model";
import { Item } from "../../items/shared/item.model";
import { Workgroup } from "../../work-groups/shared/workgroup.model";
import { SparePart } from "../../spare-parts/shared/spare-part.model";
import { SparePartDialogComponent } from "../spare-part-dialog/spare-part-dialog.component";
import { ItemMaintenDialogComponent } from "../item-mainten-dialog/item-mainten-dialog.component";
import { DialogInfo } from 'src/app/shared2/basemode/dialog-info.model';
import { ObsoleteItem } from 'src/app/obsolete-items/shared/obsolete-item.model';
import { ObsoleteItemDialogComponent } from '../obsolete-item-dialog/obsolete-item-dialog.component';
import { ItemMk2DialogComponent } from '../item-mk2-dialog/item-mk2-dialog.component';

@Injectable()
export class DialogsService {
  // width and height > width and height in scss master-dialog
  width: string = "950px";
  height: string = "500px";

  constructor(private dialog: MatDialog) { }

  public confirm(title: string, message: string, viewContainerRef: ViewContainerRef): Observable<boolean> {

    let dialogRef: MatDialogRef<ConfirmDialog>;
    let config: MatDialogConfig = new MatDialogConfig();
    config.viewContainerRef = viewContainerRef;

    dialogRef = this.dialog.open(ConfirmDialog, config);

    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;

    return dialogRef.afterClosed();
  }

  public context(title: string, message: string, viewContainerRef: ViewContainerRef): Observable<boolean> {

    let dialogRef: MatDialogRef<ContextDialog>;
    let config: MatDialogConfig = new MatDialogConfig();
    config.viewContainerRef = viewContainerRef;

    dialogRef = this.dialog.open(ContextDialog, config);

    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;

    return dialogRef.afterClosed();
  }

  public error(title: string, message: string, viewContainerRef: ViewContainerRef): Observable<boolean> {

    let dialogRef: MatDialogRef<ErrorDialog>;
    let config: MatDialogConfig = new MatDialogConfig();
    config.viewContainerRef = viewContainerRef;

    dialogRef = this.dialog.open(ErrorDialog, config);

    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;

    return dialogRef.afterClosed();
  }
  /**
   * 
   * @param viewContainerRef
   * @param type = mode of project dialog
   */
  public dialogSelectProject(viewContainerRef: ViewContainerRef, type: number = 0): Observable<ProjectMaster> {
    let dialogRef: MatDialogRef<ProjectDialogComponent>;
    let config: MatDialogConfig = new MatDialogConfig();

    // config
    config.viewContainerRef = viewContainerRef;
    config.data = type;
    // config.height = this.height;
    // config.width= this.width;
    config.hasBackdrop = true;

    // open dialog
    dialogRef = this.dialog.open(ProjectDialogComponent, config);
    return dialogRef.afterClosed();
  }

  /**
   * @param viewContaunerRef
   * @param type = mode 0:fastSelected
   */
  public dialogSelectItem(viewContainerRef: ViewContainerRef, type: number = 0): Observable<Item> {
    let dialogRef: MatDialogRef<ItemDialogComponent>;
    let config: MatDialogConfig = new MatDialogConfig();
    // config
    config.viewContainerRef = viewContainerRef;
    config.data = type;
    // config.height = this.height;
    // config.width= this.width;
    config.hasBackdrop = true;

    // open dialog
    dialogRef = this.dialog.open(ItemDialogComponent, config);
    return dialogRef.afterClosed();
  }

  /**
   * Group Mis
   * @param viewContainerRef
   * @param type = mode 0:fastSelected
   */
  public dialogSelectGroupMis(viewContainerRef: ViewContainerRef, type: number = 0): Observable<EmployeeGroupMis> {
    let dialogRef: MatDialogRef<GroupmisDialogComponent>;
    let config: MatDialogConfig = new MatDialogConfig();

    // config
    config.viewContainerRef = viewContainerRef;
    config.data = type;
    // config.height = this.height;
    // config.width= this.width;
    config.hasBackdrop = true;

    // open dialog
    dialogRef = this.dialog.open(GroupmisDialogComponent, config);
    return dialogRef.afterClosed();
  }

  /**
   * Require Maintenance
   * @param viewContainerRef
   * @param type
   */
  public dialogSelectRequireMaintenance(RequireMaintenanceId:number,viewContainerRef: ViewContainerRef,ShowCommand:boolean = true): Observable<number> {
    let dialogRef: MatDialogRef<RequireMaintenDialogComponent>;
    let config: MatDialogConfig = new MatDialogConfig();

    let data: { RequireMaintenanceId: number, ShowCommand: boolean };
    data = {
      RequireMaintenanceId: RequireMaintenanceId,
      ShowCommand: ShowCommand
    };
    // config
    config.viewContainerRef = viewContainerRef;
    config.data = data;
    // config.height = this.height;
    // config.width= this.width;
    config.hasBackdrop = true;

    // open dialog
    dialogRef = this.dialog.open(RequireMaintenDialogComponent, config);
    return dialogRef.afterClosed();
  }

  /**
 * Item Maintenance
 * @param viewContainerRef
 * @param ItemMaintananceId
 */
  public dialogSelectItemMaintenance(ItemMaintananceId: number, viewContainerRef: ViewContainerRef,ShowCommand:boolean = false ): Observable<number> {
    let dialogRef: MatDialogRef<ItemMaintenDialogComponent>;
    let config: MatDialogConfig = new MatDialogConfig();

    // config
    config.viewContainerRef = viewContainerRef;
    config.data = {
      ItemMaintananceId: ItemMaintananceId,
      ShowCommand: ShowCommand
    };
    // config.height = this.height;
    // config.width= this.width;
    config.hasBackdrop = true;

    // open dialog
    dialogRef = this.dialog.open(ItemMaintenDialogComponent, config);
    return dialogRef.afterClosed();
  }
  
  /**
   * Spare Part
   * @param viewContinerRef
   * @param type = mode 0:fast Selected
   */
  public dialogSelectSparePart(viewContainerRef: ViewContainerRef, type: number = 0): Observable<SparePart> {
    let dialogRef: MatDialogRef<SparePartDialogComponent>;
    let config: MatDialogConfig = new MatDialogConfig();

    // config
    config.viewContainerRef = viewContainerRef;
    config.data = type;
    // config.height = this.height;
    // config.width= this.width;
    config.hasBackdrop = true;

    // open dialog
    dialogRef = this.dialog.open(SparePartDialogComponent, config);
    return dialogRef.afterClosed();
  }

  /**
   * @param viewContainerRef
   * @param type = mode 0:fastSelected
   */
  public dialogSelectEmployee(viewContainerRef: ViewContainerRef, type: number = 0): Observable<Employee> {
    let dialogRef: MatDialogRef<EmployeeDialogComponent>;
    let config: MatDialogConfig = new MatDialogConfig();

    // config
    config.viewContainerRef = viewContainerRef;
    config.data = type;
    // config.height = this.height;
    // config.width= this.width;
    config.hasBackdrop = true;

    // open dialog
    dialogRef = this.dialog.open(EmployeeDialogComponent, config);
    return dialogRef.afterClosed();
  }

  /**
 * @param viewContainerRef
 * @param type = mode 0:fastSelected
 */
  public dialogSelectEmployees(viewContainerRef: ViewContainerRef, type: number = 1): Observable<Array<Employee>> {
    let dialogRef: MatDialogRef<EmployeeDialogComponent>;
    let config: MatDialogConfig = new MatDialogConfig();

    // config
    config.viewContainerRef = viewContainerRef;
    config.data = type;
    // config.height = this.height;
    // config.width= this.width;
    config.hasBackdrop = true;

    // open dialog
    dialogRef = this.dialog.open(EmployeeDialogComponent, config);
    return dialogRef.afterClosed();
  }

  /**
* @param viewContainerRef
* @param type = mode 0:fastSelected
*/
  public dialogSelectItems(viewContainerRef: ViewContainerRef, type: number = 1): Observable<Array<Item>> {
    let dialogRef: MatDialogRef<ItemDialogComponent>;
    let config: MatDialogConfig = new MatDialogConfig();

    // config
    config.viewContainerRef = viewContainerRef;
    config.data = type;
    // config.height = this.height;
    // config.width= this.width;
    config.hasBackdrop = true;

    // open dialog
    dialogRef = this.dialog.open(ItemDialogComponent, config);
    return dialogRef.afterClosed();
  }

/**
  * @param viewContainerRef
  * @param data = info: ReplyAssurance
  */
  public dialogInfoObsoleteItem(viewContainerRef: ViewContainerRef, data: DialogInfo<ObsoleteItem>): Observable<number> {
    let dialogRef: MatDialogRef<ObsoleteItemDialogComponent>;
    let config: MatDialogConfig = new MatDialogConfig();

    // config
    config.viewContainerRef = viewContainerRef;
    config.data = data;
    config.hasBackdrop = true;

    // open dialog
    dialogRef = this.dialog.open(ObsoleteItemDialogComponent, config);
    return dialogRef.afterClosed();
  }

  /**
  * @param viewContainerRef
  * @param data = info: ReplyAssurance
  */
  public dialogSelectedItemMk2(viewContainerRef: ViewContainerRef, data: DialogInfo<Item>): Observable<Item|Array<Item>> {
    let dialogRef: MatDialogRef<ItemMk2DialogComponent>;
    let config: MatDialogConfig = new MatDialogConfig();

    // config
    config.viewContainerRef = viewContainerRef;
    config.data = data;
    config.hasBackdrop = true;

    // open dialog
    dialogRef = this.dialog.open(ItemMk2DialogComponent, config);
    return dialogRef.afterClosed();
  }
}
