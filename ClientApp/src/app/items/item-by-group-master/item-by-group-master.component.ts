import { Component, ViewContainerRef, ViewChild } from "@angular/core";
// components
import { BaseMasterComponent } from "../../shared/base-master-component";
import { ItemByGroupTableComponent } from "../item-by-group-table/item-by-group-table.component";
// models
import { Item } from "../shared/item.model";
// services
import { AuthService } from "../../core/auth/auth.service";
import { DialogsService } from "../../dialogs/shared/dialogs.service";
import { ItemService, ItemByGroupCommunicateService } from "../shared/item.service";
// timezone
import * as moment from "moment-timezone";
import { ItemByGroup } from "../shared/item-by-group.model";

@Component({
  selector: 'app-item-by-group-master',
  templateUrl: './item-by-group-master.component.html',
  styleUrls: ['./item-by-group-master.component.scss']
})
export class ItemByGroupMasterComponent
  extends BaseMasterComponent<ItemByGroup, ItemService> {

  /** require-painting-master ctor */
  constructor(
    service: ItemService,
    serviceCom: ItemByGroupCommunicateService,
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
  ReadOnly: boolean = true;
  @ViewChild(ItemByGroupTableComponent)
  private tableComponent: ItemByGroupTableComponent;

  // on change time zone befor update to webapi
  changeTimezone(value: ItemByGroup): ItemByGroup {
    return value;
  }

  // onReload
  onReloadData(): void {
    this.tableComponent.reloadData();
  }

  //============== OverRide =================//

  // on detail view
  // abstract onDetailView(value: any): void;
  onDetailView(value?: ItemByGroup): void {
    // debug here
    this.ReadOnly = true;
    if (this.ShowEdit) {
      return;
    }
    if (value && value.GroupMis !== '-') {
      // console.log(value);
      this.service.getByMasterCode(value.GroupMis,"ItemByGroup")
        .subscribe(dbData => {
          if (dbData) {
            if (dbData.length > 0) {
              this.displayValue = {
                GroupMis: value.GroupMis,
                GroupMisString: value.GroupMisString,
                ItemCount: value.ItemCount,
                Items: [...dbData]
              };
              setTimeout(() => this.comService.toChildEdit(this.displayValue), 1000);
              return;
            }
          }
          else {
            this.displayValue = undefined;
          }
          // console.log(JSON.stringify(dbData));
        }, error => this.displayValue = undefined);
    } else {
      this.displayValue = undefined;
    }
  }

  // on detail edit
  onDetailEdit(editValue?: ItemByGroup): void {
    this.ReadOnly = false;
    if (!editValue) {
      editValue = { Items: new Array, ItemCount: 0 };
    }
    super.onDetailEdit(editValue);
  }

  // on update data
  // abstract onUpdateToDataBase(value: Model): void;
  onUpdateToDataBase(value: ItemByGroup): void {
    // update data
    this.service.updateChangeGroupOfItem(value.Items, this.authService.getAuth.UserName,value.GroupMis).subscribe(
      (complete: any) => {
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

  // on submit
  onSubmit(): void {
    this.canSave = false;
    this.onUpdateToDataBase(this.editValue);
  }
}
