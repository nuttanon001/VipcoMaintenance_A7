import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
// services
import { HttpErrorHandler } from "../../shared/http-error-handler.service";
// models
import { TypeMaintenance } from "../shared/type-maintenance.model";
// Base-Services
import { BaseRestService } from "../../shared/base-rest.service";
import { BaseCommunicateService } from "../../shared/base-communicate.service";
// rxjs
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    // "Authorization": "my-auth-token"
  })
};

@Injectable()
export class TypeMaintenService extends BaseRestService<TypeMaintenance> {
  constructor(
    http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    super(
      http,
      "api/TypeMaintenance/",
      "TypeMaintenanceService",
      "TypeMaintenanceId",
      httpErrorHandler
    )
  }

  // ===================== Get TypeMaintenance By ItemCode ===========================\\
  // get type maintenance by item
  getTypeMaintenanceByItem(ItemId: number): Observable<Array<TypeMaintenance>> {
    const options = { params: new HttpParams().set("ItemId", ItemId.toString()) };
    return this.http.get<Array<TypeMaintenance>>(this.baseUrl + "GetTypeMaintenanceByItem/", options)
      .pipe(catchError(this.handleError(this.serviceName + "/get type maintenance by item", new Array<TypeMaintenance>())));
  }
}

@Injectable()
export class TypeMaintenCommunicateService extends BaseCommunicateService<TypeMaintenance> {
  constructor() { super(); }
}
