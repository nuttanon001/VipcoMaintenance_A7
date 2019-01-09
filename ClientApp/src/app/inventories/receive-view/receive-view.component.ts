// angular
import { Component, Output, EventEmitter, Input } from "@angular/core";
// models
import { ReceiveStock } from "../shared/receive-stock.model";
// components
import { BaseViewComponent } from "../../shared/base-view-component";
// services

@Component({
  selector: 'app-receive-view',
  templateUrl: './receive-view.component.html',
  styleUrls: ['./receive-view.component.scss']
})
export class ReceiveViewComponent extends BaseViewComponent<ReceiveStock> {
  constructor(
  ) {
    super();
  }
  // Parameter
  // load more data
  onLoadMoreData(value: ReceiveStock) {
  }
}
