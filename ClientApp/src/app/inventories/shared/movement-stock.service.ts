import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
// services
import { HttpErrorHandler } from "../../shared/http-error-handler.service";
// models
import { MovementStock } from "./movement-stock.model";
// Base-Services
import { BaseRestService } from "../../shared/base-rest.service";
import { BaseCommunicateService } from "../../shared/base-communicate.service";
// rxjs

@Injectable()
export class MovementStockService extends BaseRestService<MovementStock> {
  constructor(
    http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    super(
      http,
      "api/MovementStockSp/",
      "MovementStockSpService",
      "MovementStockSpId",
      httpErrorHandler
    )
  }
}

@Injectable()
export class MovementStockCommunicateService extends BaseCommunicateService<MovementStock> {
  constructor() { super(); }
}
