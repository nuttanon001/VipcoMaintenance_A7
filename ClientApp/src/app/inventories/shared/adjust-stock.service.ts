import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
// services
import { HttpErrorHandler } from "../../shared/http-error-handler.service";
// models
import { AdjustStock } from "./adjust-stock.model";
// Base-Services
import { BaseRestService } from "../../shared/base-rest.service";
import { BaseCommunicateService } from "../../shared/base-communicate.service";
// rxjs
import { Observable } from "rxjs/Observable";
import { catchError } from "rxjs/operators";

@Injectable()
export class AdjustStockService extends BaseRestService<AdjustStock> {
  constructor(
    http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    super(
      http,
      "api/AdjustStockSp/",
      "AdjustStockService",
      "AdjustStockSpId",
      httpErrorHandler
    )
  }
}

@Injectable()
export class AdjustStockCommunicateService extends BaseCommunicateService<AdjustStock> {
  constructor() { super(); }
}
