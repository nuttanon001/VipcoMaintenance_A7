import { Component, ViewContainerRef, ViewChild } from "@angular/core";
// components
import { BaseMasterComponent } from "../../shared/base-master-component";
import { WorkGroupTableComponent } from "../work-group-table/work-group-table.component";
// models
import { Workgroup } from "../shared/workgroup.model";
// services
import { AuthService } from "../../core/auth/auth.service";
import { DialogsService } from "../../dialogs/shared/dialogs.service";
import { WorkGroupService, WorkGroupCommunicateService } from "../shared/work-group.service";
// timezone
import * as moment from "moment-timezone";
// 3rd Party

@Component({
  selector: 'app-work-group-master',
  templateUrl: './work-group-master.component.html',
  styleUrls: ["../../shared/styles/master.style.scss"],
})
export class WorkGroupMasterComponent extends BaseMasterComponent<Workgroup, WorkGroupService> {

  /** require-painting-master ctor */
  constructor(
    service: WorkGroupService,
    serviceCom: WorkGroupCommunicateService,
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

  @ViewChild(WorkGroupTableComponent)
  private tableComponent: WorkGroupTableComponent;
  // on change time zone befor update to webapi
  changeTimezone(value: Workgroup): Workgroup {
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
}
