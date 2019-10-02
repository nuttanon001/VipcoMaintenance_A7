import { BaseModel } from "./base-model.model";

export interface BaseStock extends BaseModel {
  /// <summary>
  /// Link for product project
  /// </summary>
  ProjectCode?: string;

  /// <summary>
  /// Link for product branch
  /// </summary>
  BranchCode?: string;

  /// <summary>
  /// Link for product workgroup
  /// </summary>
  WorkGroup?: string;

  /// <summary>
  /// Link for product heat-no
  /// </summary>
  HeatNo?: string;

  /// <summary>
  /// Link for product certificate
  /// </summary>
  Certificate?: string;

  /// <summary>
  /// Link for product location
  /// </summary>
  Location?: string;

  /// <summary>
  /// MaterialDatabase/ReceiptHeader/ReceiptNo
  /// reference come from paper
  /// </summary>
  ReceiptNo?: string;
}
