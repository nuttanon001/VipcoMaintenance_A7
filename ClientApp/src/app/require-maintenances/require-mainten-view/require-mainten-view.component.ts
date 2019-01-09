// angular
import { Component, Output, EventEmitter, Input } from "@angular/core";
// models
import { RequireMaintenance, RequireStatus } from "../shared/require-maintenance.model";
import { AttachFile } from "../../shared/attach-file.model";
// components
import { BaseViewComponent } from "../../shared/base-view-component";
// services
import { RequireMaintenService } from "../shared/require-mainten.service";

@Component({
  selector: 'app-require-mainten-view',
  templateUrl: './require-mainten-view.component.html',
  styleUrls: ['./require-mainten-view.component.scss']
})

export class RequireMaintenViewComponent extends BaseViewComponent<RequireMaintenance> {
  constructor(
    private service:RequireMaintenService
  ) {
    super();
  }
  //Parameter
  attachFiles: Array<AttachFile>;
  // load more data
onLoadMoreData(value: RequireMaintenance) {
  this.attachFiles = new Array;
    if (value) {
      this.service.getAttachFile(value.RequireMaintenanceId)
        .subscribe(dbAttach => this.attachFiles = dbAttach.slice());
    }
  }
}
