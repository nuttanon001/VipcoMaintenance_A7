// Angular Core
import { Component } from "@angular/core";
// Components
import { BaseTableFontData } from "../../shared/base-table-fontdata.component";
// Module
import { ItemMaintenanceHasEmp } from "../shared/item-maintenance-has-emp.model";

@Component({
  selector: 'app-item-mainten-employee-table',
  templateUrl: './item-mainten-employee-table.component.html',
  styleUrls: ['./item-mainten-employee-table.component.scss']
})
export class ItemMaintenEmployeeTableComponent extends BaseTableFontData<ItemMaintenanceHasEmp> {
  /** custom-mat-table ctor */
  constructor() {
    super();
    this.displayedColumns = ["select", "EmpCode", "ItemMainEmpString","edit"]
  }
}

