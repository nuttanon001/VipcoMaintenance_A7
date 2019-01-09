import { BaseModel } from "../../shared/base-model.model";

export interface RequisitionStock extends BaseModel {
  RequisitionStockSpId: number;
  Remark?: string;
  PaperNo?: string;
  Quantity: number;
  RequisitionDate: Date;
  // Fk
  // Employee
  RequisitionEmp?: string;
  // SparePart
  SparePartId?: number;
  // ItemMaintenance
  ItemMaintenanceId?: number;
  // MovementStockSp
  MovementStockSpId?: number;
  //ViewModel
  SparePartName?: string;
  RequisitionEmpString?: string;
  UnitPrice?: number;
  TotalPrice?: number;
}
