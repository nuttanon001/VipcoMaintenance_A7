import { Component, ViewContainerRef, ViewChild } from "@angular/core";
// components
import { BaseMasterComponent } from "../../shared/base-master-component";
import { RequireMaintenTableComponent } from "../require-mainten-table/require-mainten-table.component";
// models
import { RequireMaintenance, RequireStatus } from "../shared/require-maintenance.model";
// services
import { AuthService } from "../../core/auth/auth.service";
import { DialogsService } from "../../dialogs/shared/dialogs.service";
import { RequireMaintenService, RequireMaintenCommunicateService } from "../shared/require-mainten.service";
// timezone
import * as moment from "moment-timezone";
import { BranchService } from "../../branchs/shared/branch.service";

@Component({
  selector: 'app-require-mainten-master',
  templateUrl: './require-mainten-master.component.html',
  styleUrls: ['./require-mainten-master.component.scss'],
  providers: [BranchService]
})
export class RequireMaintenMasterComponent
  extends BaseMasterComponent<RequireMaintenance, RequireMaintenService> {
  constructor(
    service: RequireMaintenService,
    serviceCom: RequireMaintenCommunicateService,
    authService: AuthService,
    dialogsService: DialogsService,
    viewContainerRef: ViewContainerRef,
  ) {
    super(
      service,
      serviceCom,
      authService,
      dialogsService,
      viewContainerRef
    );
  }

  //Parameter

  @ViewChild(RequireMaintenTableComponent)
  private tableComponent: RequireMaintenTableComponent;
  // on change time zone befor update to webapi
  changeTimezone(value: RequireMaintenance): RequireMaintenance {
    let zone: string = "Asia/Bangkok";
    if (value !== null) {
      if (value.CreateDate !== null) {
        value.CreateDate = moment.tz(value.CreateDate, zone).toDate();
      }
      if (value.ModifyDate !== null) {
        value.ModifyDate = moment.tz(value.ModifyDate, zone).toDate();
      }
    }
    return value;
  }

  // onReload
  onReloadData(): void {
    this.tableComponent.reloadData();
  }

  // on detail edit override
  onDetailEdit(editValue?: RequireMaintenance): void {
    if (editValue) {
      if (editValue.RequireStatus !== RequireStatus.Waiting) {
        this.dialogsService.error("Access Deny", "คำขอซ่อมบำรุง อยู่ขณะดำเนินการไม่สามารถแก้ไขได้ !!!", this.viewContainerRef);
        return;
      }

      if (this.authService.getAuth) {
        if (this.authService.getAuth.LevelUser < 2) {
          if (this.authService.getAuth.UserName !== editValue.Creator) {
            this.dialogsService.error("Access Denied", "You don't have permission to access.", this.viewContainerRef);
            return;
          }
        }
      }
    }
	
    super.onDetailEdit(editValue);
  }

  //============== OverRide =================//
  // on insert data
  onInsertToDataBase(value: RequireMaintenance): void {
    if (this.authService.getAuth) {
      value["Creator"] = this.authService.getAuth.UserName || "";
    }
    let attachs: FileList | undefined = value.AttachFile;
    // change timezone
    value = this.changeTimezone(value);
    // insert data
    this.service.addModel(value).subscribe(
      (complete: any) => {
        //debug here
        //console.log("Complate", JSON.stringify(complete));
        if (complete && attachs) {
          this.onAttactFileToDataBase(complete.RequireMaintenanceId, attachs, complete.Creator || "");
        }

        if (complete) {
          this.displayValue = complete;
          this.onSaveComplete();
        } else {
          this.editValue.Creator = undefined;
          this.canSave = true;
          this.dialogsService.error("Failed !",
            "Save failed with the following error: Invalid Identifier code !!!", this.viewContainerRef);
        }
      },
      (error: any) => {
        console.error(error);
        this.editValue.Creator = undefined;
        this.canSave = true;
        this.dialogsService.error("Failed !",
          "Save failed with the following error: Invalid Identifier code !!!", this.viewContainerRef);
      }
    );
  }

  // on update data
  onUpdateToDataBase(value: RequireMaintenance): void {
    if (this.authService.getAuth) {
      value["Modifyer"] = this.authService.getAuth.UserName || "";
    }
    let attachs: FileList | undefined = value.AttachFile;
    // remove attach
    if (value.RemoveAttach) {
      this.onRemoveFileFromDataBase(value.RemoveAttach);
    }
    // change timezone
    value = this.changeTimezone(value);
    // update data
    this.service.updateModelWithKey(value).subscribe(
      (complete: any) => {
        //debug here
        //console.log("Complate", JSON.stringify(complete));
        if (complete && attachs) {
          this.onAttactFileToDataBase(complete.RequireMaintenanceId, attachs, complete.Modifyer || "Someone");
        }
        if (complete) {
          this.displayValue = complete;
          this.onSaveComplete();
        } else {
          this.canSave = true;
          this.dialogsService.error("Failed !",
            "Save failed with the following error: Invalid Identifier code !!!", this.viewContainerRef);
        }
      },
      (error: any) => {
        console.error(error);
        this.canSave = true;
        this.dialogsService.error("Failed !",
          "Save failed with the following error: Invalid Identifier code !!!", this.viewContainerRef);
      }
    );
  }

  // Attach
  // on attact file
  onAttactFileToDataBase(RequireMaintenanceId: number, Attacts: FileList, CreateBy: string): void {
    this.service.postAttactFile(RequireMaintenanceId, Attacts, CreateBy)
      .subscribe(complate => console.log("Upload Complate"), error => console.error(error));
  }

  // on remove file
  onRemoveFileFromDataBase(Attachs: Array<number>): void {
    Attachs.forEach((value: number) => {
      this.service.deleteAttactFile(value)
        .subscribe(complate => console.log("Delete Complate"), error => console.error(error));
    });
  }
}
