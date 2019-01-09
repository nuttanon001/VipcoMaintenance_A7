import { BaseModel } from "../../shared/base-model.model";

export interface Branch extends BaseModel {
  BranchId: number;
  Name?: string;
  Address?: string;
}
