// Angular Core
import { Component } from "@angular/core";
// Components
import { CustomMatTableComponent } from "../../shared/custom-mat-table/custom-mat-table.component";
// Models
import { TypeMaintenance } from "../shared/type-maintenance.model";
// Services
import { TypeMaintenService } from "../shared/type-mainten.service";
import { AuthService } from "../../core/auth/auth.service";

@Component({
  selector: 'app-type-mainten-table',
  templateUrl: './type-mainten-table.component.html',
  styleUrls: ['./type-mainten-table.component.scss']
})
export class TypeMaintenTableComponent extends CustomMatTableComponent<TypeMaintenance, TypeMaintenService>{
  // Constructor
  constructor(
    service: TypeMaintenService,
    authService: AuthService,
  ) {
    super(service, authService);
    this.displayedColumns = ["select", "Name", "Description"];
  }
}
