// Angular Core
import { Component } from "@angular/core";
// Components
import { CustomMatTableComponent } from "../../shared/custom-mat-table/custom-mat-table.component";
// Models
import { ReceiveStock } from "../shared/receive-stock.model";
// Services
import { AuthService } from "../../core/auth/auth.service";
import { ReceiveStockService } from "../shared/receive-stock.service";

@Component({
  selector: 'app-receive-table',
  templateUrl: './receive-table.component.html',
  styleUrls: ['./receive-table.component.scss']
})
export class ReceiveTableComponent extends CustomMatTableComponent<ReceiveStock, ReceiveStockService>{
  // Constructor
  constructor(
    service: ReceiveStockService,
    authService: AuthService,
  ) {
    super(service, authService);
    this.displayedColumns = ["select", "SparePartName", "Quantity", "ReceiveDate"];
  }
}
