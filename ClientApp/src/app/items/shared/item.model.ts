import { BaseModel } from "../../shared/base-model.model";

export interface Item extends BaseModel {
  ItemId: number;
  ItemCode?: string;
  Name?: string;
  Description?: string;
  Model?: string;
  Brand?: string;
  Property?: string;
  Property2?: string;
  Property3?: string;
  ItemStatus?: ItemStatus;
  ItemImage?: string;
  RegisterDate?: Date;
  CancelDate?: Date;
  // Fk
  // ItemType
  ItemTypeId?: number;
  // Employee
  EmpResponsible?: string;
  // Branch
  BranchId?: number;
  // GroupMis
  GroupMis?:string;
  // ViewModel
  ItemTypeString?: string;
  EmpResposibleString?: string;
  BranchString?: string;
  ItemStatusString?: string;
  GroupMisString?:string;
}

export enum ItemStatus {
  Use = 1,
  Repair,
  Cancel,
}
