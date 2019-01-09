// Angular Core
import { Component } from "@angular/core";
// Components
import { CustomMatTableComponent } from "../../shared/custom-mat-table/custom-mat-table.component";
// Models
import { Workgroup } from "../shared/workgroup.model";
// Services
import { WorkGroupService } from "../shared/work-group.service";
import { AuthService } from "../../core/auth/auth.service";

@Component({
  selector: "app-work-group-table",
  templateUrl: "./work-group-table.component.html",
  styleUrls: ["../../shared/custom-mat-table/custom-mat-table.component.scss"]
})
export class WorkGroupTableComponent extends CustomMatTableComponent<Workgroup, WorkGroupService>{
  // Constructor
  constructor(
    service: WorkGroupService,
    authService: AuthService,
  ) {
    super(service, authService);
    this.displayedColumns =["select", "Name", "Description"];

  }
}
