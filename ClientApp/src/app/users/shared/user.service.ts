import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
// services
import { HttpErrorHandler } from "../../shared/http-error-handler.service";
// models
import { User } from "./user.model";
// Base-Service
import { BaseRestService } from "../../shared/base-rest.service";
// rxjs
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class UserService extends BaseRestService<User> {
  constructor(
    http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    super(
      http,
      "api/User/",//"http://192.168.2.31/machinemk2/api/User/",
      "UserService",
      "UserId",
      httpErrorHandler
    )
  }

  // EmployeeAlready
  // get check employee already username
  getEmployeeAlready(empCode: string): Observable<any> {
    // Add safe, URL encoded search parameter if there is a search term
    const options = empCode ? { params: new HttpParams().set('EmpCode', empCode) } : {};

    let url: string = `${this.baseUrl}EmployeeAlready/`;
    return this.http.get<any>(url, options)
      .pipe(catchError(this.handleError(this.serviceName + "/get by employee already", false)));
  }
}
