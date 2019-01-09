// angular
import { Component, Output, EventEmitter, Input } from "@angular/core";
// models
import { TypeMaintenance } from "../shared/type-maintenance.model";
// components
import { BaseViewComponent } from "../../shared/base-view-component";
import { ItemTypeService } from "../../item-types/shared/item-type.service";

@Component({
  selector: 'app-type-mainten-view',
  templateUrl: './type-mainten-view.component.html',
  styleUrls: ['./type-mainten-view.component.scss']
})
export class TypeMaintenViewComponent extends BaseViewComponent<TypeMaintenance> {
  constructor(
    private serviceItemType: ItemTypeService
  ) {
    super();
  }
  // load more data
  onLoadMoreData(value:TypeMaintenance) {
    if (value) {
      if (value.ItemTypeId) {
        this.serviceItemType.getOneKeyNumber({ItemTypeId:value.ItemTypeId})
          .subscribe(dbData => this.displayValue.ItemTypeString = dbData.Name);
      }
    }
  }
}
