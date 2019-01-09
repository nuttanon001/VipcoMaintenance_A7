// angular
import { Component, Inject, ViewChild, OnDestroy } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
// models
import { Scroll } from "../../shared/scroll.model";
import { ProjectMaster } from "../../projects/shared/project-master.model";
// service
import { ProjectMasterService } from "../../projects/shared/project-master.service";
// rxjs
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
// base-component
import { BaseDialogComponent } from "../../shared/base-dialog.component";

@Component({
  selector: "app-project-dialog",
  templateUrl: "./project-dialog.component.html",
  styleUrls: ["./project-dialog.component.scss"],
  providers: [
    ProjectMasterService,
  ]
})
export class ProjectDialogComponent extends BaseDialogComponent<ProjectMaster, ProjectMasterService> {
  /** employee-dialog ctor */
  constructor(
    public service: ProjectMasterService,
    public dialogRef: MatDialogRef<ProjectDialogComponent>,
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
