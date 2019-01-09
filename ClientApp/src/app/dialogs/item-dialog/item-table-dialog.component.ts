// angular
import { Component } from "@angular/core";
// Components
import { ItemTableComponent } from "../../items/item-table/item-table.component";
// Services
import { ItemService } from "../../items/shared/item.service";
import { AuthService } from "../../core/auth/auth.service";
import { ItemTypeService } from "../../item-types/shared/item-type.service";

@Component({
  selector: "dialog-item-table",
  templateUrl: "../../items/item-table/item-table.component.html",
  styleUrls: ["../../shared/custom-mat-table/custom-mat-table.component.scss"]
})

export class ItemTableDialogComponent extends ItemTableComponent{
  // Constructor
  constructor(
    service: ItemService,
    authService: AuthService,
    serviceItemType: ItemTypeService,
  ) {
    super(service, authService, serviceItemType);
  }
}
