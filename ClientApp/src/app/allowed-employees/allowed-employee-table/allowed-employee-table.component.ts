import { Component, OnInit } from '@angular/core';
// Models
import { AllowedEmployee } from '../shared/allowed-employee.model';
// Components
import { BaseTableComponent } from 'src/app/shared2/baseclases/base-table.component';
// Services
import { AuthService } from 'src/app/core/auth/auth.service';
import { AllowedEmployeeService } from '../shared/allowed-employee.service';

@Component({
  selector: 'app-allowed-employee-table',
  templateUrl: './allowed-employee-table.component.html',
  styleUrls: ['./allowed-employee-table.component.scss']
})
export class AllowedEmployeeTableComponent
  extends BaseTableComponent<AllowedEmployee, AllowedEmployeeService> {

  constructor(
    service: AllowedEmployeeService,
    serviceAuth: AuthService
  ) {
    super(service, serviceAuth);

    this.isSubAction = "GetAllowedEmployeeScroll/";
    this.columns = [
      { columnName: "EmpCode", columnField: "EmpCode", cell: (row: AllowedEmployee) => row.EmpCode },
      { columnName: "Name", columnField: "NameThai", cell: (row: AllowedEmployee) => row.NameThai },
      { columnName: "SubLevel", columnField: "SubLevel", cell: (row: AllowedEmployee) => row.SubLevel },
    ];
    this.displayedColumns = this.columns.map(x => x.columnField);
    //this.displayedColumns.splice(0, 0, "select");
    this.displayedColumns.splice(0, 0, "Command");
  }
}
