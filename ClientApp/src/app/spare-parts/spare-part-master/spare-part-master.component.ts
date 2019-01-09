import { Component, ViewContainerRef, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
// components
import { BaseMasterComponent } from "../../shared/base-master-component";
import { SparePartTableComponent } from "../spare-part-table/spare-part-table.component";
// models
import { SparePart } from "../shared/spare-part.model";
// services
import { SparePartService, SparePartCommunicateService } from "../shared/spare-part.service";
import { AuthService } from "../../core/auth/auth.service";
import { DialogsService } from "../../dialogs/shared/dialogs.service";
// timezone
import * as moment from "moment-timezone";

@Component({
  selector: "app-spare-part-master",
  templateUrl: "./spare-part-master.component.html",
  styleUrls: ["./spare-part-master.component.scss"]
})
export class SparePartMasterComponent extends BaseMasterComponent<SparePart, SparePartService> {
  constructor(
    service: SparePartService,
    serviceCom: SparePartCommunicateService,
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

  @ViewChild(SparePartTableComponent)
  private tableComponent: SparePartTableComponent;

  // on change time zone befor update to webapi
  changeTimezone(value: SparePart): SparePart {
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
