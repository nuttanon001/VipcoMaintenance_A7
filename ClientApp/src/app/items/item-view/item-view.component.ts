// angular
import { Component, Output, EventEmitter, Input } from "@angular/core";
// models
import { Item } from "../shared/item.model";
import { ItemType } from "../../item-types/shared/item-type.model";
// components
import { BaseViewComponent } from "../../shared/base-view-component";
// services
import { ItemTypeService } from "../../item-types/shared/item-type.service";

@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ["../../shared/styles/view.style.scss"],
})
export class ItemViewComponent extends BaseViewComponent<Item> {
  constructor(
    private serviceItemType: ItemTypeService,
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
}
