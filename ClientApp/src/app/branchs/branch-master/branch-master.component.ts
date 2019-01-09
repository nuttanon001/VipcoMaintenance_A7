import { Component, ViewContainerRef,ViewChild } from "@angular/core";
// components
import { BaseMasterComponent } from "../../shared/base-master-component";
// models
import { Scroll } from "../../shared/scroll.model";
import { ScrollData } from "../../shared/scroll-data.model";
import { Branch } from "../shared/branch.model";
// services
import { AuthService } from "../../core/auth/auth.service";
import { DialogsService } from "../../dialogs/shared/dialogs.service";
import { BranchService,BranchCommunicateService } from "../shared/branch.service";
// timezone
import * as moment from "moment-timezone";
// 3rd Party
import { BranchTableComponent } from "../branch-table/branch-table.component";

@Component({
  selector: "app-branch-master",
  templateUrl: "./branch-master.component.html",
  styleUrls: ["../../shared/styles/master.style.scss"],
})
export class BranchMasterComponent
  extends BaseMasterComponent<Branch, BranchService> {

  /** require-painting-master ctor */
  constructor(
    service: BranchService,
    serviceCom: BranchCommunicateService,
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

  @ViewChild(BranchTableComponent)
  private tableComponent: BranchTableComponent;

  // on change time zone befor update to webapi
  changeTimezone(value: Branch): Branch {
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

  // on reload data
  onReloadData(): void {
    this.tableComponent.reloadData();
  }
}
