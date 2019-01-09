import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
// services
import { HttpErrorHandler } from "../../shared/http-error-handler.service";
// models
import { SparePart } from "../shared/spare-part.model";
// Base-Services
import { BaseRestService } from "../../shared/base-rest.service";
import { BaseCommunicateService } from "../../shared/base-communicate.service";
// rxjs
@Injectable()
export class SparePartService extends BaseRestService<SparePart> {
  constructor(
    http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    super(
      http,
      "api/SparePart/",
      "SparePartService",
      "SparePartId",
      httpErrorHandler
    )
  }
}

@Injectable()
export class SparePartCommunicateService extends BaseCommunicateService<SparePart> {
  constructor() { super(); }
}
