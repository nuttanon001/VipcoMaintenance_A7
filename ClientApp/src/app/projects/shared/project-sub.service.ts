import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
// service
import { HttpErrorHandler } from "../../shared/http-error-handler.service";
// models
import { ProjectSub } from "./project-sub.model";
// component
import { BaseRestService } from "../../shared/base-rest.service";
// rxjs

@Injectable()
export class ProjectSubService extends BaseRestService<ProjectSub> {
  constructor(
    http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    super(
      http,
      //"http://192.168.2.33/api/ProjectCodeDetail/",
      "http://192.168.2.31/machinemk2/api/version2/ProjectCodeDetail/",
      "ProjectSubService",
      "ProjectCodeDetailId",
      httpErrorHandler
    )
  }

}
