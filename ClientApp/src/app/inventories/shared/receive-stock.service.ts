import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
// services
import { HttpErrorHandler } from "../../shared/http-error-handler.service";
// models
import { ReceiveStock } from "./receive-stock.model";
// Base-Services
import { BaseRestService } from "../../shared/base-rest.service";
import { BaseCommunicateService } from "../../shared/base-communicate.service";
// rxjs
import { Observable } from "rxjs/Observable";
import { catchError } from "rxjs/operators";

@Injectable()
export class ReceiveStockService extends BaseRestService<ReceiveStock> {
  constructor(
    http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    super(
      http,
      "api/ReceiveStockSp/",
      "ReceiveStockService",
      "ReceiveStockSpId",
      httpErrorHandler
    )
  }
}

@Injectable()
export class ReceiveStockCommunicateService extends BaseCommunicateService<ReceiveStock> {
  constructor() { super(); }
}
