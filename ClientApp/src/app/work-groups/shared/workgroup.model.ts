import { BaseModel } from "../../shared/base-model.model";

export interface Workgroup extends BaseModel {
  WorkGroupId: number;
  Name?: string;
  Description?: string;
  Remark?: string;
}
