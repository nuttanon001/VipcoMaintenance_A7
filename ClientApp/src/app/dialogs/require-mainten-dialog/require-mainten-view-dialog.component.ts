import { Component } from "@angular/core";
// Components
import { RequireMaintenViewComponent } from "../../require-maintenances/require-mainten-view/require-mainten-view.component";
import { RequireMaintenService } from "../../require-maintenances/shared/require-mainten.service";

@Component({
  selector: "app-require-mainten-view-dialog",
  templateUrl: "../../require-maintenances/require-mainten-view/require-mainten-view.component.html",
  styleUrls: ["../../require-maintenances/require-mainten-view/require-mainten-view.component.scss"]
})
export class RequireMaintenViewDialogComponent extends RequireMaintenViewComponent {
  constructor(
    service:RequireMaintenService
  ) {
    super(service);
  }
}
