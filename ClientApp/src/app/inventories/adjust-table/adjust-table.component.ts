// Angular Core
import { Component } from "@angular/core";
// Components
import { CustomMatTableComponent } from "../../shared/custom-mat-table/custom-mat-table.component";
// Models
import { AdjustStock } from "../shared/adjust-stock.model";
// Services
import { AuthService } from "../../core/auth/auth.service";
import { AdjustStockService } from "../shared/adjust-stock.service";

@Component({
  selector: 'app-adjust-table',
  templateUrl: './adjust-table.component.html',
  styleUrls: ['./adjust-table.component.scss']
})
export class AdjustTableComponent extends CustomMatTableComponent<AdjustStock, AdjustStockService>{
  // Constructor
  constructor(
    service: AdjustStockService,
    authService: AuthService,
  ) {
    super(service, authService);
    this.displayedColumns = ["select", "SparePartName", "Quantity", "AdjustDate"];
  }
}
