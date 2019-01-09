import { BaseModel } from "../../shared/base-model.model";

export interface ItemMaintenanceHasEmp extends BaseModel {
  ItemMainHasEmployeeId: number;
  Remark?: string;
  // FK
  // ItemMaintenance
  ItemMaintenanceId?: number;
  // Employee
  EmpCode?: string;
  //ViewModel
  ItemMainEmpString?: string;
}
