// angular
import { Component, Output, EventEmitter, Input } from "@angular/core";
// models
import { AdjustStock } from "../shared/adjust-stock.model";
// components
import { BaseViewComponent } from "../../shared/base-view-component";
// services

@Component({
  selector: 'app-adjust-view',
  templateUrl: './adjust-view.component.html',
  styleUrls: ['./adjust-view.component.scss']
})

export class AdjustViewComponent extends BaseViewComponent<AdjustStock> {
  constructor(
  ) {
    super();
  }
  // Parameter
  // load more data
  onLoadMoreData(value: AdjustStock) {
  }
}
