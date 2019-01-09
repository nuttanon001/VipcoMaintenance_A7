import { Component, ViewContainerRef, ViewChild } from "@angular/core";
// components
import { BaseMasterComponent } from "../../shared/base-master-component";
import { TypeMaintenTableComponent } from "../type-mainten-table/type-mainten-table.component";
// models
import { TypeMaintenance } from "../shared/type-maintenance.model";
// services
import { AuthService } from "../../core/auth/auth.service";
import { DialogsService } from "../../dialogs/shared/dialogs.service";
import { TypeMaintenService, TypeMaintenCommunicateService } from "../shared/type-mainten.service";
// timezone
import * as moment from "moment-timezone";

@Component({
  selector: 'app-type-mainten-master',
  templateUrl: './type-mainten-master.component.html',
  styleUrls: ['./type-mainten-master.component.scss']
})
export class TypeMaintenMasterComponent extends BaseMasterComponent<TypeMaintenance, TypeMaintenService> {

  /** require-painting-master ctor */
  constructor(
    service: TypeMaintenService,
    serviceCom: TypeMaintenCommunicateService,
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

  @ViewChild(TypeMaintenTableComponent)
  private tableComponent: TypeMaintenTableComponent;
  // on change time zone befor update to webapi
  changeTimezone(value: TypeMaintenance): TypeMaintenance {
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
