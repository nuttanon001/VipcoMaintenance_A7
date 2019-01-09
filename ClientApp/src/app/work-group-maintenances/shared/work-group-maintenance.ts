import { BaseModel } from "../../shared/base-model.model";

export interface WorkGroupMaintenance extends BaseModel {
    WorkGroupMaintenanceId: number;
    Name?:string;
    Description?:string;
    Remark?:string;
}
