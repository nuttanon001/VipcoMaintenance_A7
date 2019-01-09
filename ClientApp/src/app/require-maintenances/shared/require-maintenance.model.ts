import { BaseModel } from "../../shared/base-model.model";
import { AttachFile } from "../../shared/attach-file.model";

export interface RequireMaintenance extends BaseModel {
  RequireMaintenanceId: number;
  RequireNo?: string;
  RequireDate?: Date;
  RequireDateTime?: string;
  Description?: string;
  Remark?: string;
  RequireStatus?: RequireStatus;
  MailApply?: string;
  MaintenanceApply?: Date;
  // FK
  // GroupMis
  GroupMIS?: string;
  // Employee
  RequireEmp?: string;
  // Item
  ItemId?: number;
  // Branch
  BranchId?: number;
  // ProjectCodeMaster
  ProjectCodeMasterId?: number;
  // ViewModel
  ItemCode?: string;
  RequireEmpString?: string;
  ProjectCodeMasterString?: string;
  GroupMISString?: string;
  BranchString?: string;
  RequireStatusString?: string;
  ItemMaintenanceId?: number;
  // Attach Model
  AttachFile?: FileList;
  RemoveAttach?: Array<number>;
}

export enum RequireStatus {
  Waiting = 1,
  InProcess,
  Complate,
  Cancel,
  MaintenanceResponse
}
