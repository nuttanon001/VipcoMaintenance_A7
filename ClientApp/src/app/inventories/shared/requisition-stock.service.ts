import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
// services
import { HttpErrorHandler } from '../../shared/http-error-handler.service';
// models
import { RequisitionStock } from './requisition-stock.model';
// Base-Services
import { BaseRestService } from '../../shared/base-rest.service';
import { BaseCommunicateService } from '../../shared/base-communicate.service';
// rxjs
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable()
export class RequisitionStockService extends BaseRestService<RequisitionStock> {
  constructor(
    http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    super(
      http,
      'api/RequisitionStockSp/',
      'RequisitionStockService',
      'RequisitionStockSpId',
      httpErrorHandler
    );
  }

  // ===================== Requisition by Item Maintenance ===========================\\
  // action require maintenance
  getRequisitionByItemMaintenance(ItemMaintenanceId: number): Observable<RequisitionStock[] | any> {
    const options = { params: new HttpParams().set('key', ItemMaintenanceId.toString()) };
    return this.http.get<RequisitionStock[]>(this.baseUrl + 'GetRequisitionByItemMaintenance/', options)
      .pipe(catchError(this.handleError(this.serviceName + '/get requisition by item maintenance model',<RequisitionStock[]> [])));
  }
}

@Injectable()
export class RequisitionStockCommunicateService extends BaseCommunicateService<RequisitionStock> {
  constructor() { super(); }
}
