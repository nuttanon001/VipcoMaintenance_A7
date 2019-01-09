import { BaseModel } from "../../shared/base-model.model";
import { RequisitionStock } from "../../inventories/shared/requisition-stock.model";
import { ItemMaintenanceHasEmp } from "./item-maintenance-has-emp.model";

export interface ItemMaintenance extends BaseModel {
  ItemMaintenanceId: number;
  ItemMaintenanceNo?: string;
  PlanStartDate?: Date;
  PlanEndDate?: Date;
  ActualStartDate?: Date;
  ActualStartDateTime?: string;
  ActualEndDate?: Date;
  ActualEndDateTime?: string;
  StatusMaintenance?: StatusMaintenance;
  Description?: string;
  Remark?: string;
  WorkGroupMaintenanceId?: number;
  // FK
  // Employee
  MaintenanceEmp?: string;
  // RequireMaintenance
  RequireMaintenanceId?: number;
  // TypeMaintenance
  TypeMaintenanceId?: number;
  RequisitionStockSps?: Array<RequisitionStock>;
  ItemMainHasEmployees?: Array<ItemMaintenanceHasEmp>;
  //ViewModel
  ItemCode?: string;
  MaintenanceEmpString?: string;
  TypeMaintenanceString?: string;
  StatusMaintenanceString?: string;
  WorkGroupMaintenanceString?: string;
}

export enum StatusMaintenance {
  TakeAction = 1,
  InProcess,
  WaitSpare,
  OutSouce,
  Complate,
  Cancel
}
