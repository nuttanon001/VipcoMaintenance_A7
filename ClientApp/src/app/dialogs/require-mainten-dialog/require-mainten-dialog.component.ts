import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
// models
import { RequireMaintenance } from "../../require-maintenances/shared/require-maintenance.model";
// services
import { RequireMaintenService } from "../../require-maintenances/shared/require-mainten.service";

@Component({
  selector: "app-require-mainten-dialog",
  templateUrl: "./require-mainten-dialog.component.html",
  styleUrls: ["./require-mainten-dialog.component.scss"],
  providers: [RequireMaintenService]
})

export class RequireMaintenDialogComponent implements OnInit {
  /** require-painting-view-dialog ctor */
  constructor(
    private service: RequireMaintenService,
    @Inject(MAT_DIALOG_DATA) public data: { RequireMaintenanceId: number, ShowCommand: boolean },
    private dialogRef: MatDialogRef<number>) { }

  // Parameter
  requireMainten: RequireMaintenance;
  canClose: boolean;

  /** Called by Angular after cutting-plan-dialog component initialized */
  ngOnInit(): void {
    this.canClose = false;
    if (this.data) {
      this.service.getOneKeyNumber({ RequireMaintenanceId: this.data.RequireMaintenanceId})
        .subscribe(dbData => {
          this.requireMainten = dbData;
        }, error => this.onCancelClick());
    } else {
      this.onCancelClick();
    }
  }

  // Selected Value
  onSelectedValue(value?: number): void {
    if (value) {
      this.dialogRef.close(value);
    }
  }

  // No Click
  onCancelClick(mode: number = 0): void {
    if (mode === 0) {
      this.dialogRef.close();
    } else {
      this.dialogRef.close(mode);
    }
  }
}
