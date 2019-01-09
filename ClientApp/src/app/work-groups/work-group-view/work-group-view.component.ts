// angular
import { Component, Output, EventEmitter, Input } from "@angular/core";
// models
import { Workgroup } from "../shared/workgroup.model";
// components
import { BaseViewComponent } from "../../shared/base-view-component";

@Component({
  selector: 'app-work-group-view',
  templateUrl: './work-group-view.component.html',
  styleUrls: ["../../shared/styles/view.style.scss"],
})
export class WorkGroupViewComponent extends BaseViewComponent<Workgroup> {
  constructor() {
    super();
  }
  // load more data
  onLoadMoreData() { }
}
