// Angular Core
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpEventType, HttpHeaders } from '@angular/common/http';
// Models
import { AttachFile } from './attach-file.model';
import { ObsoleteItem } from './obsolete-item.model';
import { Scroll } from 'src/app/shared2/basemode/scroll.model';
import { ScrollData } from 'src/app/shared2/basemode/scroll-data.model';
// Services
import { BaseRestService } from 'src/app/shared2/baseclases/base-rest.service';
import { HttpErrorHandler } from 'src/app/shared2/baseclases/http-error-handler.service';
// Rxjs
import { Observable } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ObsoleteItemService extends BaseRestService<ObsoleteItem> {

  constructor(
    http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    super(
      http,
      "api/ItemHasCancel/",
      "ItemHasCancelService",
      "ItemHasCancelId",
      httpErrorHandler
    )
  }

  /** get all with scroll data */
  getSchedule(scroll: Scroll, subAction: string = "GetSchedule/"): Observable<any | ScrollData<any>> {
    // console.log(this.baseUrl + subAction);

    return this.http.post<ScrollData<any>>(this.baseUrl + subAction, JSON.stringify(scroll),
      {
        headers: new HttpHeaders({ "Content-Type": "application/json" })
      }).pipe(shareReplay(), catchError(this.handleError("Get models for schedule component", <ScrollData<any>>{})));
  }

  // ===================== Upload File ===============================\\
  // get file
  getAttachFile(MasterId: number): Observable<any | Array<AttachFile>> {
    return this.http.get<Array<AttachFile>>(this.baseUrl + "GetAttach/",
      { params: new HttpParams().set("key", MasterId.toString()) })
      .pipe(catchError(this.handleError(this.serviceName + "/get attach file.", Array<AttachFile>())));
  }

  // upload file
  postAttactFile(MasterId: number, files: Array<File>, CreateBy: string): Observable<any> {
    if (files.length === 0)
      return;

    const formData = new FormData();

    for (let i: number = 0; i < files.length; i++) {
      if (files[i].size <= 5242880) {
        formData.append("files", files[i]);
      }
    }

    const uploadReq = new HttpRequest('POST', `${this.baseUrl}PostAttach/`, formData, {
      params: new HttpParams().set("key", MasterId.toString()).set("CreateBy", CreateBy),
      reportProgress: true,
    });

    /* this.http.request(uploadReq).subscribe(event => {
       if (event.type === HttpEventType.UploadProgress) {
         console.log(Math.round(100 * event.loaded / event.total));
       } else if (event.type === HttpEventType.Response) {
         console.log(event.body.toString());
       }
     });
     */
    return this.http.request(uploadReq)
      .pipe(catchError(this.handleError(this.serviceName + "/update attach file failed.", <any>{})));
  }

  // delete file
  deleteAttactFile(AttachFileString: string): Observable<any> {
    return this.http.delete<any>(this.baseUrl + "DeleteAttach/",
      { params: new HttpParams().set("AttachFileString", AttachFileString) })
      .pipe(catchError(this.handleError(this.serviceName + "/delete attach file", <any>{})));
  }

  // ===================== End Upload File ===========================\\

  getPaperReport(receiptId: number, subReport: string = "GetReport/"): Observable<any> {
    let url: string = this.baseUrl + subReport;
    return this.http.get(url, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }),
      params: new HttpParams().set("key", receiptId.toString()),
      responseType: 'blob' // <-- changed to blob 
    }).pipe(map(res => this.downloadFile(res, 'application/xlsx', 'export.xlsx')));
  }
}
