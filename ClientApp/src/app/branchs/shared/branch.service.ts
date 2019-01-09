import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
// services
import { HttpErrorHandler } from "../../shared/http-error-handler.service"
// models
import { Branch } from "./branch.model";
// Base-Services
import { BaseRestService } from "../../shared/base-rest.service";
import { BaseCommunicateService } from "../../shared/base-communicate.service";
// rxjs
import { Observable } from "rxjs/Observable";
import { catchError } from "rxjs/operators";

@Injectable()
export class BranchService extends BaseRestService<Branch> {
  constructor(
    http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    super(
      http,
      "api/Branch/",
      "BranchService",
      "BranchId",
      httpErrorHandler
    )
  }
}

@Injectable()
export class BranchCommunicateService extends BaseCommunicateService<Branch> {
  constructor() { super(); }
}
