import { Component, ViewContainerRef, ViewChild } from "@angular/core";
// components
import { BaseMasterComponent } from "../../shared/base-master-component";
import { WorkGroupMaintenTableComponent } from "../work-group-mainten-table/work-group-mainten-table.component";
// models
import { WorkGroupMaintenance } from "../shared/work-group-maintenance";
// services
import { AuthService } from "../../core/auth/auth.service";
import { DialogsService } from "../../dialogs/shared/dialogs.service";
import { WorkGroupMaintenService, WorkGroupMaintenCommunicateService } from "../shared/work-group-mainten.service";
// timezone
import * as moment from "moment-timezone";
// 3rd Party

@Component({
  selector: 'app-work-group-mainten-master',
  templateUrl: './work-group-mainten-master.component.html',
  styleUrls: ['./work-group-mainten-master.component.scss']
})
export class WorkGroupMaintenMasterComponent extends BaseMasterComponent<WorkGroupMaintenance, WorkGroupMaintenService> {

  /** require-painting-master ctor */
  constructor(
    service: WorkGroupMaintenService,
    serviceCom: WorkGroupMaintenCommunicateService,
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
  @ViewChild(WorkGroupMaintenTableComponent)
  private tableComponent: WorkGroupMaintenTableComponent;
  // on change time zone befor update to webapi
  changeTimezone(value: WorkGroupMaintenance): WorkGroupMaintenance {
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
