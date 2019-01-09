import { Component, ViewContainerRef, ViewChild } from "@angular/core";
// components
import { BaseMasterComponent } from "../../shared/base-master-component";
import { ItemTypeTableComponent } from "../item-type-table/item-type-table.component";
// models
import { ItemType } from "../shared/item-type.model";
// services
import { AuthService } from "../../core/auth/auth.service";
import { DialogsService } from "../../dialogs/shared/dialogs.service";
import { ItemTypeService, ItemTypeCommunicateService } from "../shared/item-type.service";
// timezone
import * as moment from "moment-timezone";

@Component({
  selector: 'app-item-type-master',
  templateUrl: './item-type-master.component.html',
  styleUrls: ["../../shared/styles/master.style.scss"],
})
export class ItemTypeMasterComponent extends BaseMasterComponent<ItemType, ItemTypeService> {

  /** require-painting-master ctor */
  constructor(
    service: ItemTypeService,
    serviceCom: ItemTypeCommunicateService,
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

  @ViewChild(ItemTypeTableComponent)
  private tableComponent: ItemTypeTableComponent;

  // on change time zone befor update to webapi
  changeTimezone(value: ItemType): ItemType {
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
