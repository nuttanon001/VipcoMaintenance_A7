// Angular Core
import { Component } from "@angular/core";
// Components
import { CustomMatTableComponent } from "../../shared/custom-mat-table/custom-mat-table.component";
// Models
import { Branch } from "../shared/branch.model";
// Services
import { BranchService } from "../shared/branch.service";
import { AuthService } from "../../core/auth/auth.service";
// Styles
@Component({
  selector: "app-branch-table",
  templateUrl: "./branch-table.component.html",
  styleUrls: ["../../shared/custom-mat-table/custom-mat-table.component.scss"]
})
export class BranchTableComponent extends CustomMatTableComponent<Branch, BranchService>{
  // Constructor
  constructor(
    service: BranchService,
    authService: AuthService,
  ) {
    super(service, authService);
    this.displayedColumns =["select", "Name", "Address"];
  }
}
