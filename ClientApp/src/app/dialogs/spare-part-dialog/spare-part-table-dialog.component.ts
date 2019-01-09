// angular
import { Component } from "@angular/core";
// Components
import { SparePartTableComponent } from "../../spare-parts/spare-part-table/spare-part-table.component";
// Services
import { AuthService } from "../../core/auth/auth.service";
import { SparePartService } from "../../spare-parts/shared/spare-part.service";

@Component({
  selector: 'spare-part-table-dialog',
  templateUrl: '../../spare-parts/spare-part-table/spare-part-table.component.html',
  styleUrls: ['./spare-part-table-dialog.component.scss']
})
export class SparePartTableDialogComponent extends SparePartTableComponent{
  // Constructor
  constructor(
    service: SparePartService,
    authService: AuthService,
  ) {
    super(service, authService);
  }
}
