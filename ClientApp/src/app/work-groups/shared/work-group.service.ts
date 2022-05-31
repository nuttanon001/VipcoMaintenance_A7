import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
// services
import { HttpErrorHandler } from "../../shared/http-error-handler.service";
// models
import { Workgroup } from "../shared/workgroup.model";
// Base-Services
import { BaseRestService } from "../../shared/base-rest.service";
import { BaseCommunicateService } from "../../shared/base-communicate.service";
// rxjs
import { catchError } from "rxjs/operators";

@Injectable()
export class WorkGroupService extends BaseRestService<Workgroup> {
  constructor(
    http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    super(
      http,
      "api/WorkGroup/",
      "WorkGroupService",
      "WorkGroupId",
      httpErrorHandler
    )
  }
}

@Injectable()
export class WorkGroupCommunicateService extends BaseCommunicateService<Workgroup> {
  constructor() { super(); }
}
