import { BaseModel } from "../../shared/base-model.model";

export interface TypeMaintenance extends BaseModel {
  TypeMaintenanceId: number;
  Name?: string;
  Description?: string;
  // FK
  ItemTypeId?: number;
  // ViewModel
  ItemTypeString?: string;
}
