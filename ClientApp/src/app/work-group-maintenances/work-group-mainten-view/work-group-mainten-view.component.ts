// angular
import { Component, Output, EventEmitter, Input } from "@angular/core";
// models
import { WorkGroupMaintenance } from "../shared/work-group-maintenance";
// components
import { BaseViewComponent } from "../../shared/base-view-component";

@Component({
  selector: 'app-work-group-mainten-view',
  templateUrl: './work-group-mainten-view.component.html',
  styleUrls: ['./work-group-mainten-view.component.scss']
})
export class WorkGroupMaintenViewComponent extends BaseViewComponent<WorkGroupMaintenance> {
  constructor() {
    super();
  }
  // load more data
  onLoadMoreData() { }
}
