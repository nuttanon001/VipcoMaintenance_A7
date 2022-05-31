import { BaseModel } from "../../shared/base-model.model";

export interface TypeMaintenance extends BaseModel {
  TypeMaintenanceId: number;
  Name?: string;
  Description?: string;
  StandardTime? : number;
  // FK
  ItemTypeId?: number;
  // ViewModel
  ItemTypeString?: string;
}
