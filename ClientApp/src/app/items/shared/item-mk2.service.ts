import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Models
import { Item } from './item.model';
// Services
import { BaseRestService } from 'src/app/shared2/baseclases/base-rest.service';
import { HttpErrorHandler } from 'src/app/shared2/baseclases/http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ItemMk2Service extends BaseRestService<Item> {

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
}
