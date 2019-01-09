import { BaseModel } from "../../shared/base-model.model";

export interface AdjustStock extends BaseModel {
  AdjustStockSpId: number;
  Description?: string;
  Remark?: string;
  AdjustDate?: Date;
  Quantity?: number;
  //FK
  // Employee
  EmpCode?: string;
  // SparePart
  SparePartId?: number;
  // MovementStockSp
  MovementStockSpId?: number;
  //ViewModel
  SparePartName?: string;
  AdjustEmpString?: string;
}
