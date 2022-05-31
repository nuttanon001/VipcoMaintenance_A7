// angular
import { Component, Inject, ViewChild, OnDestroy } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
// models
import { SparePart } from "../../spare-parts/shared/spare-part.model";
// service
import { SparePartService } from "../../spare-parts/shared/spare-part.service";
// rxjs
// base-component
import { BaseDialogComponent } from "../../shared/base-dialog.component";

@Component({
  selector: 'spare-part-dialog',
  templateUrl: './spare-part-dialog.component.html',
  styleUrls: ['./spare-part-dialog.component.scss'],
  providers: [SparePartService]
})
export class SparePartDialogComponent extends BaseDialogComponent<SparePart, SparePartService> {
  /** employee-dialog ctor */
  constructor(
    public service: SparePartService,
    public dialogRef: MatDialogRef<SparePartDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public mode: number
  ) {
    super(
      service,
      dialogRef
    );
  }

  // on init
  onInit(): void {
    this.fastSelectd = true;
  }
}
