// Angular Core
import { Component } from "@angular/core";
// Components
import { CustomMatTableComponent } from "../../../shared/custom-mat-table/custom-mat-table.component";
// Models
import { Employee } from "../../../employees/shared/employee.model";
// Services
import { EmployeeService } from "../../../employees/shared/employee.service";
import { AuthService } from "../../../core/auth/auth.service";

@Component({
  selector: "dialog-employee-table",
  templateUrl: "./employee-table.component.html",
  styleUrls: ["../../../shared/custom-mat-table/custom-mat-table.component.scss"]
})
export class EmployeeTableComponent extends CustomMatTableComponent<Employee, EmployeeService>{
  // Constructor
  constructor(
    service: EmployeeService,
    authService: AuthService,
  ) {
    super(service, authService);
    this.displayedColumns = ["select", "EmpCode", "NameThai", "GroupName"];
  }
}
