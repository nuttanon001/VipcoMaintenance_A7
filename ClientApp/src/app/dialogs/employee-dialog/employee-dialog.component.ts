// angular
import { Component, Inject, ViewChild, OnDestroy } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
// models
import { Employee } from "../../employees/shared/employee.model";
// service
import { EmployeeService } from "../../employees/shared/employee.service";
// rxjs
// base-component
import { BaseDialogComponent } from "../../shared/base-dialog.component";

@Component({
  selector: "employee-dialog",
  templateUrl: "./employee-dialog.component.html",
  styleUrls: ["../../shared/styles/master.style.scss"],
  providers: [
    EmployeeService,
  ]
})
/** employee-dialog component*/
export class EmployeeDialogComponent
  extends BaseDialogComponent<Employee, EmployeeService> {
  /** employee-dialog ctor */
  constructor(
    public service: EmployeeService,
    public dialogRef: MatDialogRef<EmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public mode: number
  ) {
    super(
      service,
      dialogRef
    );
  }

  // on init
  onInit(): void {
    this.fastSelectd = this.mode === 0 ? true : false;
  }
}
