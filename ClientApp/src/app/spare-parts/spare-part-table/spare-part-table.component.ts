// Angular Core
import { Component, Input } from "@angular/core";
// Components
import { CustomMatTableComponent } from "../../shared/custom-mat-table/custom-mat-table.component";
// Models
import { SparePart } from "../shared/spare-part.model";
// Services
import { AuthService } from "../../core/auth/auth.service";
import { SparePartService } from "../shared/spare-part.service";

@Component({
  selector: 'app-spare-part-table',
  templateUrl: './spare-part-table.component.html',
  styleUrls: ['./spare-part-table.component.scss']
})
export class SparePartTableComponent extends CustomMatTableComponent<SparePart, SparePartService>{
  // Constructor
  constructor(
    service: SparePartService,
    authService: AuthService,
  ) {
    super(service, authService);
    this.displayedColumns = ["select", "Name", "Model", "OnHand"];
  }

  @Input() isDialog: boolean = false;
}
