import { BaseModel } from "../../shared/base-model.model";

export interface ReceiveStock extends BaseModel {
  ReceiveStockSpId: number;
  PurchaseOrder?: string;
  Remark?: string;
  Quantity: number;
  ReceiveDate: Date;
  // FK
  // Employee
  ReceiveEmp?: string;
  // SparePart
  SparePartId?: number;
  // MovementStockSp
  MovementStockSpId?: number;
  //ViewModel
  SparePartName?: string;
  ReceiveEmpString?: string;
}
