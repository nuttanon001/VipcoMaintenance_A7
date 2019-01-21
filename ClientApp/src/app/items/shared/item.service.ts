import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
// services
import { HttpErrorHandler } from "../../shared/http-error-handler.service";
// models
import { Item } from "../../items/shared/item.model";
// Base-Services
import { BaseRestService } from "../../shared/base-rest.service";
import { BaseCommunicateService } from "../../shared/base-communicate.service";
// rxjs
import { Observable } from "rxjs";
import { catchError,map } from "rxjs/operators";
import { Scroll } from "../../shared/scroll.model";
import { ItemByGroup } from "./item-by-group.model";
import { ItemHistoriesOption } from "./item-histories-option.model";
import { ItemHistories } from "./item-histories.model";

@Injectable()
export class ItemService extends BaseRestService<Item> {
  constructor(
    http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    super(
      http,
      "api/Item/",
      "ItemService",
      "ItemId",
      httpErrorHandler
    )
  }
  /** item histories maintenance */
  getItemHistories(itemOption: ItemHistoriesOption): Observable<Array<ItemHistories>> {
    return this.http.post<Array<ItemHistories>>(this.baseUrl + "ItemHistories/", JSON.stringify(itemOption), {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    }).pipe(catchError(this.handleError(this.serviceName + "/get item history", new Array<ItemHistories>())));
  }
  /** update with key number */
  updateChangeGroupOfItem(item: Array<Item>, ByEmp: string, Group: string): Observable<any> {
    // console.log("item", JSON.stringify(item),ByEmp,Group);

    return this.http.put<any>(this.baseUrl +"ChangeGroupOfItem/", JSON.stringify(item), {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      params: new HttpParams().set("Group", Group).set("ByEmp", ByEmp)
    }).pipe(catchError(this.handleError(this.serviceName + "/put update change group of item",<any>{})));
  }
  /**
   * Get Excel File
   * @param key
   */
  getXlsx(itemOption?: ItemHistoriesOption): Observable<any> {
    let url: string = this.baseUrl + "ItemHistoriesExport/";

    return this.http.get(url, {
      params: new HttpParams().set("key", itemOption.ItemId.toString()),
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }),
      responseType: 'blob' // <-- changed to blob 
    }).pipe(map(res => this.downloadFile(res, 'application/xlsx', 'export.xlsx')));
  }

  getXlsxScroll(scroll: Scroll): Observable<any> {
    let url: string = this.baseUrl + "GetReport/";

    return this.http.post(url, JSON.stringify(scroll), {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }),
      responseType: 'blob' // <-- changed to blob 
    }).pipe(map(res => this.downloadFile(res, 'application/xlsx', 'export.xlsx')));
  }
}

@Injectable()
export class ItemCommunicateService extends BaseCommunicateService<Item> {
  constructor() { super(); }
}

@Injectable()
export class ItemByGroupCommunicateService extends BaseCommunicateService<ItemByGroup> {
  constructor() { super(); }
}

