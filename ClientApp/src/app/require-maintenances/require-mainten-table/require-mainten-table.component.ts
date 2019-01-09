// Angular Core
import { Component } from "@angular/core";
// Components
import { CustomMatTableComponent } from "../../shared/custom-mat-table/custom-mat-table.component";
// Models
import { RequireMaintenance } from "../shared/require-maintenance.model";
// Services
import { AuthService } from "../../core/auth/auth.service";
import { RequireMaintenService } from "../shared/require-mainten.service";

@Component({
  selector: "app-require-mainten-table",
  templateUrl: "./require-mainten-table.component.html",
  styleUrls: ["./require-mainten-table.component.scss"]
})
export class RequireMaintenTableComponent extends CustomMatTableComponent<RequireMaintenance, RequireMaintenService>{
  // Constructor
  constructor(
    service: RequireMaintenService,
    authService: AuthService,
  ) {
    super(service, authService);
    this.displayedColumns =["select", "RequireNo", "ItemCode", "RequireDate"];

  }
}

