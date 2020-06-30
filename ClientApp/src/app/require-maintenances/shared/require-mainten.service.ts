import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
// services
import { HttpErrorHandler } from '../../shared/http-error-handler.service';
// models
import { RequireMaintenance } from './require-maintenance.model';
import { OptionRequireMaintenance } from './option-require-maintenance.model';
import { AttachFile } from '../../shared/attach-file.model';
// Base-Services
import { BaseRestService } from '../../shared/base-rest.service';
import { BaseCommunicateService } from '../../shared/base-communicate.service';
// rxjs
import { Observable } from 'rxjs/Observable';
import { catchError, map } from 'rxjs/operators';
import { OptionItemMaintenSchedule } from '../../item-maintenances/shared/option-item-mainten-schedule.model';
import { retry } from 'rxjs/operator/retry';
import { Scroll } from 'src/app/shared2/basemode/scroll.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    // "Authorization": "my-auth-token"
  })
};

@Injectable()
export class RequireMaintenService extends BaseRestService<RequireMaintenance> {
  constructor(
    http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    super(
      http,
      'api/RequireMaintenance/',
      'RequireMaintenService',
      'RequireMaintenanceId',
      httpErrorHandler
    );
  }

  // ===================== Action Require Maintenance ===========================\\
  // action require maintenance
  actionRequireMaintenance(RequireMaintenaceId: number, ByEmployee: string): Observable<RequireMaintenance> {
    const options = {
      params: new HttpParams().set('key', RequireMaintenaceId.toString()).set('byEmp', ByEmployee)
    };
    return this.http.get<RequireMaintenance>(this.baseUrl + 'ActionRequireMaintenance/', options)
      .pipe(catchError(this.handleError(this.serviceName + '/action require maintenance model', <RequireMaintenance>{})));
  }

  // ===================== Require Maintenance Schedule ===========================\\
  // get Require Maintenance Schedule
  getRequireMaintenanceSchedule(option: Scroll): Observable<any> {
    const url = `${this.baseUrl}MaintenanceWaiting/`;

    return this.http.post<any>(url, JSON.stringify(option), httpOptions)
      .pipe(catchError(this.handleError(this.serviceName + '/maintenance waiting', <any>{})))
      .shareReplay();
  }

  // ===================== Require Maintenance With Item Maintenance Schedule ===========================\\
  getRequireMaintenanceWithItemMaintenanceSchedule(option: OptionItemMaintenSchedule): Observable<any> {
    const url = `${this.baseUrl}ScheduleWithRequire/`;
    return this.http.post<any>(url, JSON.stringify(option), httpOptions)
      .pipe(catchError(this.handleError(this.serviceName + '/main schedule require maintenance', <any>{})))
      .shareReplay();
  }

  // ===================== Upload File ===============================\\
  // get file
  getAttachFile(RequireMaintenanceId: number): Observable<Array<AttachFile>> {
    return this.http.get<Array<AttachFile>>(this.baseUrl + 'GetAttach/',
      { params: new HttpParams().set('key', RequireMaintenanceId.toString()) })
      .pipe(catchError(this.handleError(this.serviceName + '/get attach file.', Array<AttachFile>())));
  }

  // upload file
  postAttactFile(RequireMaintenanceId: number, files: FileList, CreateBy: string): Observable<any> {
    const input: any = new FormData();
    for (let i = 0; i < files.length; i++) {
      if (files[i].size <= 5242880) {
        input.append('files', files[i]);
      }
    }
    return this.http.post<any>(`${this.baseUrl}PostAttach/`, input,
      { params: new HttpParams().set('key', RequireMaintenanceId.toString()).set('CreateBy', CreateBy) })
      .pipe(catchError(this.handleError(this.serviceName + '/upload attach file', <any>{})));
  }

  // delete file
  deleteAttactFile(AttachId: number): Observable<any> {
    return this.http.delete<any>(this.baseUrl + 'DeleteAttach/',
      { params: new HttpParams().set('AttachFileId', AttachId.toString()) })
      .pipe(catchError(this.handleError(this.serviceName + '/delete attach file', <any>{})));
  }

  getXlsx(scroll: Scroll, subReport: string = 'GetReport/'): Observable<any> {
    const url: string = this.baseUrl + subReport;

    return this.http.post(url, JSON.stringify(scroll), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }),
      responseType: 'blob' // <-- changed to blob
    }).pipe(map(res => this.downloadFile(res, 'application/xlsx', 'export.xlsx')));
  }

  // ===================== End Upload File ===========================\\
}

@Injectable()
export class RequireMaintenCommunicateService extends BaseCommunicateService<RequireMaintenance> {
  constructor() { super(); }
}
