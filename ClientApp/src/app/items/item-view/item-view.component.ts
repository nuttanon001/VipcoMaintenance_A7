// angular
import { Component, Output, EventEmitter, Input, ViewContainerRef } from "@angular/core";
// models
import { Item, ItemStatus } from "../shared/item.model";
import { ItemType } from "../../item-types/shared/item-type.model";
// components
import { BaseViewComponent } from "../../shared/base-view-component";
// services
import { ItemTypeService } from "../../item-types/shared/item-type.service";
import { DialogsService } from 'src/app/dialogs/shared/dialogs.service';

@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ["../../shared/styles/view.style.scss"],
})
export class ItemViewComponent extends BaseViewComponent<Item> {
  constructor(
    private serviceItemType: ItemTypeService,
    private serviceDialogs: DialogsService,
    private viewContainerRef: ViewContainerRef,
  ) {
    super();
  }

  // load more data
  onLoadMoreData(item: Item) {
    // if (item) {
    //  if (item.ItemTypeId) {
    //    this.serviceItemType.getOneKeyNumber(
    //      <ItemType> {
    //        ItemTypeId: item.ItemTypeId
    //       }
    //     ).subscribe(dbItemType => {
    //       this.displayValue.ItemTypeString = dbItemType.Name;
    //     });
    //   }
    // }
  }

  // open ObsoleteItem
  openObsoleteItem(): void {
    if (this.displayValue) {
      if (this.displayValue.ItemStatus === ItemStatus.Cancel) {
        this.serviceDialogs.dialogInfoObsoleteItem(this.viewContainerRef,
          {
            info:
            {
              ObsoleteItemId: 0,
              ItemId: this.displayValue.ItemId
            },
            multi: false,
            option: false
          }).subscribe();
      }
    }
  }
}
