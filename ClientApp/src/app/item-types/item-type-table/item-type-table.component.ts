// Angular Core
import { Component } from "@angular/core";
// Components
import { CustomMatTableComponent } from "../../shared/custom-mat-table/custom-mat-table.component";
// Models
import { ItemType } from "../shared/item-type.model";
// Services
import { ItemTypeService } from "../shared/item-type.service";
import { AuthService } from "../../core/auth/auth.service";

@Component({
  selector: "app-item-type-table",
  templateUrl: "./item-type-table.component.html",
  styleUrls: ["../../shared/custom-mat-table/custom-mat-table.component.scss"]
})
export class ItemTypeTableComponent extends CustomMatTableComponent<ItemType, ItemTypeService>{
  // Constructor
  constructor(
    service: ItemTypeService,
    authService: AuthService,
  ) {
    super(service, authService);
    this.displayedColumns = ["select","Name","Description"];
  }
}
