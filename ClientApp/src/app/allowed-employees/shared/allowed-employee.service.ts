// Angular Core
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// Services
import { BaseRestService } from 'src/app/shared2/baseclases/base-rest.service';
import { HttpErrorHandler } from 'src/app/shared2/baseclases/http-error-handler.service';
// Models
import { AllowedEmployee } from './allowed-employee.model';
// Rxjs
import { Observable } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AllowedEmployeeService extends BaseRestService<AllowedEmployee> {

  constructor(
    http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    super(
      http,
      "api/Employee/",
      "AllowedEmployeeService",
      "EmpCode",
      httpErrorHandler
    )
  }

  /** add Model @param nObject */
  addModel(nObject: AllowedEmployee): Observable<any | AllowedEmployee> {
    // debug here
    // console.log("Path:", this.baseUrl);
    // console.log("Data is:", JSON.stringify(nObject));

    return this.http.post<AllowedEmployee>(this.baseUrl + "UpdateAllowedEmployee/", JSON.stringify(nObject), {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    }).pipe(catchError(this.handleError("Add model", <AllowedEmployee>{})));
  }

  updateModelWithKey(uObject: AllowedEmployee): Observable<any | AllowedEmployee> {
    return this.http.post<AllowedEmployee>(this.baseUrl, JSON.stringify(uObject), {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    }).pipe(catchError(this.handleError("Update model", <AllowedEmployee>{})));
  }

  /** get one with key number */
  getOneKeyNumber(value: AllowedEmployee): Observable<AllowedEmployee> {
    // Add safe, URL encoded search parameter if there is a search term
    const options = value ? { params: new HttpParams().set("key", value["EmpCode"].toString()) } : {};
    return this.http.get<AllowedEmployee>(this.baseUrl + "GetAllowedEmployee/", options)
      .pipe(shareReplay(), catchError(this.handleError("Get model with key", <AllowedEmployee>{})));
  }
}

