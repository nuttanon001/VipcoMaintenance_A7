// angular
import { Component, Inject, ViewChild, OnDestroy } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
// models
import { EmployeeGroupMis } from "../../employees/shared/employee-group-mis.model";
// service
import { EmployeeGroupMisService } from "../../employees/shared/employee-group-mis.service";
// rxjs
// base-component
import { BaseDialogComponent } from "../../shared/base-dialog.component";

@Component({
  selector: 'app-groupmis-dialog',
  templateUrl: './groupmis-dialog.component.html',
  styleUrls: ['./groupmis-dialog.component.scss'],
  providers: [EmployeeGroupMisService]
})
export class GroupmisDialogComponent extends BaseDialogComponent<EmployeeGroupMis, EmployeeGroupMisService> {
  /** employee-dialog ctor */
  constructor(
    public service: EmployeeGroupMisService,
    public dialogRef: MatDialogRef<GroupmisDialogComponent>,
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
