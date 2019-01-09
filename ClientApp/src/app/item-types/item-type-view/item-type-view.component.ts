// angular
import { Component, Output, EventEmitter, Input } from "@angular/core";
// models
import { ItemType } from "../shared/item-type.model";
// components
import { BaseViewComponent } from "../../shared/base-view-component";

@Component({
  selector: 'app-item-type-view',
  templateUrl: './item-type-view.component.html',
  styleUrls: ["../../shared/styles/view.style.scss"],
})
export class ItemTypeViewComponent extends BaseViewComponent<ItemType> {
  constructor() {
    super();
  }
  // load more data
  onLoadMoreData() { }
}
