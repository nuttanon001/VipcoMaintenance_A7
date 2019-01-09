import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
// service
import { HttpErrorHandler } from "../../shared/http-error-handler.service";
// models
import { Employee } from "../../employees/shared/employee.model";
// component
import { BaseRestService } from "../../shared/base-rest.service";
// rxjs
import { Observable } from "rxjs/Observable";

@Injectable()
export class EmployeeService extends BaseRestService<Employee> {
  constructor(
    http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    super(
      http,
      //"api/Employee/",
      "http://192.168.2.31/machinemk2/api/version2/Employee/",
      "EmployeeService",
      "EmpCode",
      httpErrorHandler
    )
  }
}
