import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
// service
import { HttpErrorHandler } from "../../shared/http-error-handler.service";
// models
import { ProjectMaster } from "./project-master.model";
// component
import { BaseRestService } from "../../shared/base-rest.service";
// rxjs
import { Observable } from "rxjs/Observable";
import { Scroll } from 'src/app/shared2/basemode/scroll.model';
import { ScrollData } from 'src/app/shared2/basemode/scroll-data.model';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ProjectMasterService extends BaseRestService<ProjectMaster> {
  constructor(
    http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    super(
      http,
      //"api/ProjectCodeMaster/",
      //"http://192.168.2.31/machinemk2/api/version2/ProjectCodeMaster/",
      "http://192.168.2.31/overtime/api/ProjectCode/",
      "ProjectMasterService",
      "ProjectCodeMasterId",
      httpErrorHandler
    )
  }

  /** get all with scroll data */
  getAllWithScroll(scroll: Scroll, subAction: string = "GetScrollV2/"): Observable<ScrollData<ProjectMaster>> {
    // console.log(this.baseUrl + subAction
    return this.http.post<ScrollData<ProjectMaster>>(this.baseUrl + subAction, JSON.stringify(scroll),
      { headers: new HttpHeaders({"Content-Type": "application/json",})}
    ).pipe(catchError(this.handleError(this.serviceName + "/get scroll", <ScrollData<ProjectMaster>>{})));
    // catchError(this.handleError(this.serviceName + "/get scroll", <ScrollData<Model>>{}))
  }
}
