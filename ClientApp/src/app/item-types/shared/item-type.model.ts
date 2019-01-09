import { BaseModel } from "../../shared/base-model.model";

export interface ItemType extends BaseModel {
  ItemTypeId: number;
  Name?: string;
  Description?: string;
  Remark?: string;
  // fk
  // WorkGroup
  WorkGroupId?: number;
}
