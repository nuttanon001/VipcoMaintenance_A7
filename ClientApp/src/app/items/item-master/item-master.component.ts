import { Component, ViewContainerRef,ViewChild } from "@angular/core";
// components
import { BaseMasterComponent } from "../../shared/base-master-component";
import { ItemTableComponent } from "../item-table/item-table.component";
// models
import { Item } from "../shared/item.model";
// services
import { AuthService } from "../../core/auth/auth.service";
import { DialogsService } from "../../dialogs/shared/dialogs.service";
import { ItemService, ItemCommunicateService } from "../shared/item.service";
// timezone
import * as moment from "moment-timezone";

@Component({
  selector: 'app-item-master',
  templateUrl: './item-master.component.html',
  styleUrls: ["../../shared/styles/master.style.scss"],
})
export class ItemMasterComponent extends BaseMasterComponent<Item, ItemService> {

  /** require-painting-master ctor */
  constructor(
    service: ItemService,
    serviceCom: ItemCommunicateService,
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

  @ViewChild(ItemTableComponent)
  private tableComponent: ItemTableComponent;

  // on change time zone befor update to webapi
  changeTimezone(value: Item): Item {
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
