import { Component, ViewContainerRef, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
// components
import { BaseMasterComponent } from "../../shared/base-master-component";
import { ReceiveTableComponent } from "../receive-table/receive-table.component";
// models
import { ReceiveStock } from "../shared/receive-stock.model";
// services
import { AuthService } from "../../core/auth/auth.service";
import { DialogsService } from "../../dialogs/shared/dialogs.service";
import { ReceiveStockService, ReceiveStockCommunicateService } from "../shared/receive-stock.service";
// timezone
import * as moment from "moment-timezone";

@Component({
  selector: 'app-receive-master',
  templateUrl: './receive-master.component.html',
  styleUrls: ['./receive-master.component.scss']
})
export class ReceiveMasterComponent extends BaseMasterComponent<ReceiveStock, ReceiveStockService> {
  constructor(
    service: ReceiveStockService,
    serviceCom: ReceiveStockCommunicateService,
    authService: AuthService,
    dialogsService: DialogsService,
    viewContainerRef: ViewContainerRef,
    private router: Router,
    private route: ActivatedRoute,
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
  backToSchedule: boolean = false;

  @ViewChild(ReceiveTableComponent)
  private tableComponent: ReceiveTableComponent;

  // on change time zone befor update to webapi
  changeTimezone(value: ReceiveStock): ReceiveStock {
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
