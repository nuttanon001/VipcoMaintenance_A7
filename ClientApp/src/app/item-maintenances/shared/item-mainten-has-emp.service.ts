import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
// services
import { HttpErrorHandler } from "../../shared/http-error-handler.service";
// models
import { ItemMaintenanceHasEmp } from "./item-maintenance-has-emp.model";
// Base-Services
import { BaseRestService } from "../../shared/base-rest.service";
import { BaseCommunicateService } from "../../shared/base-communicate.service";
// rxjs
import { catchError } from "rxjs/operators";
import { ItemMaintenance } from "./item-maintenance.model";
import { Observable } from "rxjs";

@Injectable()
export class ItemMaintenHasEmpService extends BaseRestService<ItemMaintenanceHasEmp> {
  constructor(
    http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    super(
      http,
      "api/ItemMainHasEmployee/",
      "ItemMainHasEmployeeService",
      "ItemMainHasEmployeeId",
      httpErrorHandler
    )
  }

  // ===================== Action Item Maintenance has employee ===========================\\
  // action item maintenance has employee
  actionItemMaintenanceHasEmployee(ItemMaintenanceId: number): Observable<ItemMaintenanceHasEmp[] | any> {
    const options = {
      params: new HttpParams().set("key", ItemMaintenanceId.toString())
    };
    return this.http.get<Array<ItemMaintenanceHasEmp>>(this.baseUrl + "GetItemMainHasEmpByItemMainten/", options)
      .pipe(catchError(this.handleError(this.serviceName + "/action get item maintenance has employee model", new Array<ItemMaintenanceHasEmp>())));
  }

  // ===================== Post Items Maintenance has employee ===========================\\
  addItemsModel(Items: Array<ItemMaintenanceHasEmp>,ItemMaintenanceId:number): Observable<any> {
    return this.http.post<Array<ItemMaintenanceHasEmp>>(this.baseUrl, JSON.stringify(Items), {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      params: new HttpParams().set("key", ItemMaintenanceId.toString())
    }).pipe(catchError(this.handleError(this.serviceName + "/post items", Items)));
  }
}
