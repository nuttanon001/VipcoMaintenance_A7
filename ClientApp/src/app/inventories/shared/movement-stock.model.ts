import { BaseModel } from "../../shared/base-model.model";

export interface MovementStock extends BaseModel {
  MovementStockSpId: number;
  MovementDate ?: Date;
  Quantity?: number;
  MovementStatus?: MovementStatus;
}

export enum MovementStatus {
  ReceiveStock = 1,
  RequisitionStock,
  AdjustIncrement,
  AdjustDecrement,
  Cancel
}
