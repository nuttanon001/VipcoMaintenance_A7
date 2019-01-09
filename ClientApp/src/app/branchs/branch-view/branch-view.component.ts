// angular
import { Component, Output, EventEmitter, Input } from "@angular/core";
// models
import { Branch } from "../shared/branch.model";
// components
import { BaseViewComponent } from "../../shared/base-view-component";
@Component({
  selector: 'app-branch-view',
  templateUrl: './branch-view.component.html',
  styleUrls: ["../../shared/styles/view.style.scss"],
})
export class BranchViewComponent extends BaseViewComponent<Branch> {
  constructor() {
    super();
  }
  // load more data
  onLoadMoreData() {}
}
