import { BaseModel } from 'src/app/shared2/basemode/base-model.model';

export interface ObsoleteItem extends BaseModel {
  ObsoleteItemId?: number;
  /// <summary>
  /// Doc no.
  /// </summary>
  ObsoleteNo?: string;
  /// <summary>
  /// Cancel date
  /// </summary>
  ObsoleteDate?: Date;
  /// <summary>
  /// Amount of item
  /// </summary>
  FixedAsset?: number;
  /// <summary>
  /// Approve first part by
  /// </summary>
  Approve1?: string;
  /// <summary>
  /// Name of Approve first
  /// </summary>
  Approve1NameThai?: string;
  /// <summary>
  /// Datetime of approve
  /// </summary>
  Approve1Date?: Date;
  /// <summary>
  /// ForeignKey Item
  /// </summary>
  ItemId?: number;
  /// <summary>
  /// Object item for reference
  /// </summary>
  /// <summary>
  /// Description for cancel item
  /// </summary>
  Description?: string;
  /// <summary>
  /// Request cancel itme
  /// </summary>
  Request?: string;
  /// <summary>
  /// Request cancel item name
  /// </summary>
  RequestNameThai?: string;
  /// <summary>
  /// Approve2 cancel item
  /// </summary>
  Approve2?: string;
  /// <summary>
  /// Approve2 cancel item name
  /// </summary>
  Approve2NameThai?: string;
  /// <summary>
  /// Approve2 date
  /// </summary>
  Approve2Date?: Date;
  Status?: StatusObsolete;
  Remark?: string;
  ApproveToFix?: boolean;
  ApproveToObsolete?: boolean;
  ComplateBy?: string;
  ComplateByNameThai?: string;
  // ViewModels
  ItemCode?: string;
  ItemName?: string;
  AttachFiles?: Array<File>;
  RemoveAttach?: Array<number>;

}

export enum StatusObsolete {
  ApproveLevel1 = 1,
  ApproveLevel2,
  ApproveLevel3,
  FixOnly,
  Cancel
}
