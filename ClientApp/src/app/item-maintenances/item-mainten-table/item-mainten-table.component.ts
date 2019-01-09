// Angular Core
import { Component } from "@angular/core";
// Components
import { CustomMatTableComponent } from "../../shared/custom-mat-table/custom-mat-table.component";
// Models
import { ItemMaintenance } from "../shared/item-maintenance.model";
// Services
import { AuthService } from "../../core/auth/auth.service";
import { ItemMaintenService } from "../shared/item-mainten.service";

@Component({
  selector: 'app-item-mainten-table',
  templateUrl: './item-mainten-table.component.html',
  styleUrls: ['./item-mainten-table.component.scss']
})
export class ItemMaintenTableComponent extends CustomMatTableComponent<ItemMaintenance, ItemMaintenService>{
  // Constructor
  constructor(
    service: ItemMaintenService,
    authService: AuthService,
  ) {
    super(service, authService);
    this.displayedColumns = ["select", "ItemCode", "TypeMaintenanceString", "StatusMaintenanceString"];

  }
}
