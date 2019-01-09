// Angular Core
import { Component } from "@angular/core";
// Components
import { CustomMatTableComponent } from "../../../shared/custom-mat-table/custom-mat-table.component";
// Models
import { ProjectMaster } from "../../../projects/shared/project-master.model";
// Services
import { ProjectMasterService } from "../../../projects/shared/project-master.service";
import { AuthService } from "../../../core/auth/auth.service";

@Component({
  selector: "dialog-project-table",
  templateUrl: "./project-table.component.html",
  styleUrls: ["./project-table.component.scss"]
})
export class ProjectTableComponent extends CustomMatTableComponent<ProjectMaster, ProjectMasterService>{
  // Constructor
  constructor(
    service: ProjectMasterService,
    authService: AuthService,
  ) {
    super(service, authService);
    this.displayedColumns = ["select", "ProjectCode", "ProjectName"];

  }
}

