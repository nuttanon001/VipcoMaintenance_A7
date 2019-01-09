import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
// services
import { HttpErrorHandler } from "../../shared/http-error-handler.service";
// models
import { WorkGroupMaintenance } from "../shared/work-group-maintenance";
// Base-Services
import { BaseRestService } from "../../shared/base-rest.service";
import { BaseCommunicateService } from "../../shared/base-communicate.service";
// rxjs

@Injectable()
export class WorkGroupMaintenService extends BaseRestService<WorkGroupMaintenance> {
  constructor(
    http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    super(
      http,
      "api/WorkGroupMaintenance/",
      "WorkGroupMaintenanceService",
      "WorkGroupMaintenanceId",
      httpErrorHandler
    )
  }
}

@Injectable()
export class WorkGroupMaintenCommunicateService extends BaseCommunicateService<WorkGroupMaintenance> {
  constructor() { super(); }
}
