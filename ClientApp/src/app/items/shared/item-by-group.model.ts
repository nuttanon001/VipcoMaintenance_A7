import { Item } from "./item.model";
import { BaseModel } from "../../shared/base-model.model";

export interface ItemByGroup extends BaseModel {
  GroupMis?: string;
  GroupMisString?: string;
  ItemCount?: number;
  Items?: Array<Item>;
}
