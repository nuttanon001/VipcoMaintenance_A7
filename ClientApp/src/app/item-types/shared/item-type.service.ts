import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
// services
import { HttpErrorHandler } from "../../shared/http-error-handler.service";
// models
import { ItemType } from "./item-type.model";
// Base-Services
import { BaseRestService } from "../../shared/base-rest.service";
import { BaseCommunicateService } from "../../shared/base-communicate.service";
// rxjs

@Injectable()
export class ItemTypeService extends BaseRestService<ItemType> {
  constructor(
    http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    super(
      http,
      "api/ItemType/",
      "ItemTypeService",
      "ItemTypeId",
      httpErrorHandler
    )
  }
}

@Injectable()
export class ItemTypeCommunicateService extends BaseCommunicateService<ItemType> {
  constructor() { super(); }
}

