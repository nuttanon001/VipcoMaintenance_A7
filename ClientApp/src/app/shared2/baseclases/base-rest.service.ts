// core modules
import {
  HttpClient, HttpHeaders,
  HttpParams
} from "@angular/common/http";
// rxjs
import { Observable } from "rxjs";
import { catchError, retry, tap ,shareReplay, switchMap} from "rxjs/operators";
// models
import { ScrollData } from "../basemode/scroll-data.model";
import { Scroll } from "../basemode/scroll.model";
// services
import { HttpErrorHandler, HandleError } from "./http-error-handler.service";

const httpOptions = {
  headers: new HttpHeaders ({
    "Content-Type" : "application/json",
    // "Authorization": "my-auth-token"
  })
};

export abstract class BaseRestService<Model>{
  constructor(
    protected http: HttpClient,
    protected baseUrl: string,
    protected serviceName: string,
    public keyName: string,
    protected httpErrorHandler: HttpErrorHandler
  ) {
    this.handleError = httpErrorHandler.createHandleError(serviceName);
  }
  /* Parameter */
  public handleError: HandleError;

  //===================== Privete Members =======================\\
  // extract data
  public extractData(r: Response) { // for extractdata
    let body = r.json();
    // console.log(body);
    return body || {};
  }
  // extract data for result code
  private extractResultCode(res: Response) {
    if (res) {
      if (res.status === 201) {
        return [{ status: res.status, json: res }]
      }
      else if (res.status === 200) {
        return [{ status: res.status, json: res }]
      }
    }
  }
  // set log
  private log(filename: string, data: string) {
    const message = `DownloaderService downloaded "${filename}" and got "${data}".`;
    console.log(message);
  }
  // set log error
  private logError(filename: string, error: any) {
    const message = `DownloaderService failed to download "${filename}"; got error "${error.message}".`;
    console.error(message);
  }

  //===================== HTTP-Rest =============================\\
  /** GET Models from the server */
  getAll(): Observable<Array<Model>> {
    return this.http.get<Array<Model>>(this.baseUrl)
      .pipe(shareReplay(),catchError(this.handleError("Get models.", new Array<Model>())));
  }
  /** get one with key number */
  getOneKeyNumber(value: Model): Observable<Model> {
    // Add safe, URL encoded search parameter if there is a search term
    const options = value ? { params: new HttpParams().set("key", value[this.keyName].toString()) } : {};
    return this.http.get<Model>(this.baseUrl + "GetKeyNumber/", options)
      .pipe(shareReplay(),catchError(this.handleError("Get model with key", <Model>{} )));
  }
  /** get one with key string */
  getOneKeyString(value: Model): Observable<Model> {
    // Add safe, URL encoded search parameter if there is a search term
    const options = value ? { params: new HttpParams().set("key", value[this.keyName]) } : {};

    return this.http.get<Model>(this.baseUrl + "GetKeyString/", options)
      .pipe(shareReplay(),catchError(this.handleError("Get model with key", <Model>{})));
  }

  /** get auto complate */
  getAutoComplate(): Observable<Array<string>> {
    let url: string = `${this.baseUrl}GetAutoComplate/`;
    return this.http.get<Array<string>>(url)
      .pipe(shareReplay(),catchError(this.handleError("Get auto complate string", new Array<string>())));
  }

  /** get by master id */
  getByMasterId(masterId: number, subAction: string = "GetByMaster/"): Observable<Array<Model>> {
    // Add safe, URL encoded search parameter if there is a search term
    const options = masterId ? { params: new HttpParams().set('key', masterId.toString()) } : {};

    let url: string = this.baseUrl + subAction;
    return this.http.get<Array<Model>>(url, options)
      .pipe(shareReplay(),catchError(this.handleError("Get details by master key", new Array<Model>())));
  }

  /** get by master id */
  getByMasterCode(masterCode: string, subAction: string = "GetByMaster/"): Observable<any |Array<Model>> {
    // Add safe, URL encoded search parameter if there is a search term
    const options = masterCode ? { params: new HttpParams().set("key", masterCode) } : {};

    let url: string = this.baseUrl + subAction;
    return this.http.get<Array<Model>>(url, options)
      .pipe(shareReplay(),catchError(this.handleError("Get details by master key", new Array<Model>())));
  }

  /** get all with scroll data */
  getAllWithScroll(scroll: Scroll, subAction: string = "GetScroll/"): Observable<any |ScrollData<Model>> {
    // console.log(this.baseUrl + subAction);

    return this.http.post<ScrollData<Model>>(this.baseUrl + subAction, JSON.stringify(scroll), httpOptions)
      .pipe(shareReplay(),catchError(this.handleError("Get models for scroll component", <ScrollData<Model>>{})));
  }

  // get all with page
  //getAllWithPage(page: Page, subAction: string = "GetPage/"): Observable<PageData<Model>> {
  //    return this.http.post(this.baseUrl + subAction, JSON.stringify(page), this.getRequestOption())
  //        .map(this.extractData).catch(this.handleError);
  //}

  /** add Model @param nObject */
  addModel(nObject: Model): Observable<any |Model> {
    // debug here
    // console.log("Path:", this.baseUrl);
    // console.log("Data is:", JSON.stringify(nObject));

    return this.http.post<Model>(this.baseUrl, JSON.stringify(nObject), httpOptions)
      .pipe(shareReplay(),catchError(this.handleError("Add model", <Model>{})));
  }

  /** add Model @param nObject */
  addModel2(nObject: Model): Observable<any> {
    // debug here
    // console.log("Path:", this.baseUrl);
    // console.log("Data is:", JSON.stringify(nObject));

    return this.http.post(this.baseUrl, JSON.stringify(nObject), httpOptions)
      .pipe(switchMap(value => {
        return this.updateModelWithKey(<Model>value);
      }), catchError(this.handleError("Add model", <Model>{})));
  }
 

  /** update with key number */
  updateModelWithKey(uObject: Model): Observable<any |Model> {
    return this.http.put<Model>(this.baseUrl, JSON.stringify(uObject), {
      headers: httpOptions.headers,
      params: new HttpParams().set("key", uObject[this.keyName].toString())
    }).pipe(shareReplay(),catchError(this.handleError("Update model", <Model>{})));
  }

  /** update with key string */
  updateModelWithString(uObject: Model): Observable<any |Model> {
    return this.http.put<Model>(this.baseUrl, JSON.stringify(uObject), {
      headers: httpOptions.headers,
      params: new HttpParams().set("key", uObject[this.keyName])
    }).pipe(shareReplay(),catchError(this.handleError("Update model", <Model>{})));
  }

  /** put update model */
  // updateModel(uObject: Model): Observable<any |Model> {
  //  return this.http.put<Model>(this.baseUrl, JSON.stringify(uObject), httpOptions)
  //    .pipe(catchError(this.handleError("Update model", uObject)));
  // }

  /** delete with key number*/
  deleteKeyNumber(value: Model): Observable<any> {
    let httpOptions1 = {
      headers: new HttpHeaders({ "Content-Type": "application/json", }),
      params: new HttpParams().set("key",value[this.keyName])
    };
    return this.http.delete(this.baseUrl, httpOptions1)
      .pipe(shareReplay(),catchError(this.handleError("Delete model")));
  }

  getTextFile(filename: string) {
    // The Observable returned by get() is of type Observable<string>
    // because a text response was specified.
    // There's no need to pass a <string> type parameter to get().
    return this.http.get(filename, { responseType: "text" })
      .pipe(
        tap( // Log the result or error
          data => this.log(filename, data),
          error => this.logError(filename, error)
      ));
  }

  downloadFile(blob: any, type: string, filename: string): string {
    const url = window.URL.createObjectURL(blob); // <-- work with blob directly

    // create hidden dom element (so it works in all browsers)
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);

    // create file, attach to hidden element and open hidden element
    a.href = url;
    a.download = filename;
    a.click();
    return url;
  }
}

export function funcDownloadFile(blob: any, type: string, filename: string): string {
  const url = window.URL.createObjectURL(blob); // <-- work with blob directly

  // create hidden dom element (so it works in all browsers)
  const a = document.createElement('a');
  a.setAttribute('style', 'display:none;');
  document.body.appendChild(a);

  // create file, attach to hidden element and open hidden element
  a.href = url;
  a.download = filename;
  a.click();
  return url;
}
