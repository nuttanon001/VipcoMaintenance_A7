// angular
import { Component, Output, EventEmitter, Input } from "@angular/core";
// models
import { SparePart } from "../shared/spare-part.model";
// components
import { BaseViewComponent } from "../../shared/base-view-component";

@Component({
  selector: 'app-spare-part-view',
  templateUrl: './spare-part-view.component.html',
  styleUrls: ['./spare-part-view.component.scss']
})
export class SparePartViewComponent extends BaseViewComponent<SparePart> {
  constructor(
  ) {
    super();
  }
  // Parameter

  // load more data
  onLoadMoreData(value: SparePart) { }
}
