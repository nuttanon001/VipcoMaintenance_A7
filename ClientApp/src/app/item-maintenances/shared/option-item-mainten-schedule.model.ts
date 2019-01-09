export interface OptionItemMaintenSchedule {
  Filter?: string;
  ProjectMasterId?: number;
  ProjectMasterString?: string;
  Skip?: number;
  Take?: number;
  // <summary>
  /// 1 : All Task Without cancel
  /// null or 2 : Wait and Process only
  /// </summary>
  Mode?: number;
  /// <summary>
  /// Filter user require maintenance
  /// </summary>
  Creator?: string;
  CreatorName?: string;
  /// <summary>
  /// ItemMaintenance
  /// </summary>
  ItemMaintenanceId?: number;
  /// <summary>
  /// RequireMaintenance
  /// </summary>
  RequireMaintenanceId?: number;
  /// <summary>
  /// WorkGroupMaintenanceId
  /// </summary>
  GroupMaintenanceId?: number;
  /// <summary>
  /// TypeMaintenanceId
  /// </summary>
  TypeMaintenanceId?: number;
  ItemTypeId?: number;
  /// <summary>
  /// Start date
  /// </summary>
  SDate?: Date;
  /// <summary>
  /// End date
  /// </summary>
  EDate?: Date;
}
