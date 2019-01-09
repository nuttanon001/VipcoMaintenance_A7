import { Component, ViewContainerRef, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
// components
import { BaseMasterComponent } from "../../shared/base-master-component";
import { AdjustTableComponent } from "../adjust-table/adjust-table.component";
// models
import { AdjustStock } from "../shared/adjust-stock.model";
// services
import { AuthService } from "../../core/auth/auth.service";
import { DialogsService } from "../../dialogs/shared/dialogs.service";
import { AdjustStockService, AdjustStockCommunicateService } from "../shared/adjust-stock.service";
// timezone
import * as moment from "moment-timezone";

@Component({
  selector: 'app-adjust-master',
  templateUrl: './adjust-master.component.html',
  styleUrls: ['./adjust-master.component.scss']
})

export class AdjustMasterComponent extends BaseMasterComponent<AdjustStock, AdjustStockService> {
  constructor(
    service: AdjustStockService,
    serviceCom: AdjustStockCommunicateService,
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

  @ViewChild(AdjustTableComponent)
  private tableComponent: AdjustTableComponent;

  // on change time zone befor update to webapi
  changeTimezone(value: AdjustStock): AdjustStock {
    return value;
  }

  // onReload
  onReloadData(): void {
    this.tableComponent.reloadData();
  }
}
