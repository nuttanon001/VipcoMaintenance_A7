// Angular Core
import { Component } from "@angular/core";
// Components
import { CustomMatTableComponent } from "../../shared/custom-mat-table/custom-mat-table.component";
// Models
import { WorkGroupMaintenance } from "../shared/work-group-maintenance";
// Services
import { WorkGroupMaintenService } from "../shared/work-group-mainten.service";
import { AuthService } from "../../core/auth/auth.service";

@Component({
  selector: 'app-work-group-mainten-table',
  templateUrl: './work-group-mainten-table.component.html',
  styleUrls: ['./work-group-mainten-table.component.scss']
})
export class WorkGroupMaintenTableComponent extends CustomMatTableComponent<WorkGroupMaintenance, WorkGroupMaintenService>{
  // Constructor
  constructor(
    service: WorkGroupMaintenService,
    authService: AuthService,
  ) {
    super(service, authService);
    this.displayedColumns = ["select", "Name", "Description"];

  }
}
