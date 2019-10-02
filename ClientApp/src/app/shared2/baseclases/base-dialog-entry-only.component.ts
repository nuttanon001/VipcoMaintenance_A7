import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
// models
import { Scroll } from "../basemode/scroll.model";
// rxjs
import { BaseModel } from "../basemode/base-model.model";
import { BaseRestService } from "./base-rest.service";
// 3rd party
// import { DatatableComponent, TableColumn } from "@swimlane/ngx-datatable";

/** base-dialog component*/
export abstract class BaseDialogEntryOnlyComponent<Model extends BaseModel>
  implements OnInit {
  /** cutting-plan-dialog ctor */
  constructor(
    protected dialogRef: MatDialogRef<any>
  ) { }

  // Parameter
  InfoValue: Model;
  getValue: Model;
  /** Called by Angular after cutting-plan-dialog component initialized */
  ngOnInit(): void {
    this.onInit();
  }

  // on Init data
  abstract onInit(): void;

  // No Click
  onCancelClick(): void {
    this.dialogRef.close();
  }

  // Update Click
  onSelectedClick(): void {
    if (this.getValue) {
      this.dialogRef.close(this.getValue);
    }
  }

  // on new entity
  // abstract onNewEntity(): void;

  // on info
  onInfoComplate(infoValue?: { data: Model | undefined, force: boolean }): void {
    if (infoValue) {
      if (infoValue.force) {
        this.dialogRef.close(infoValue.data);
      } else {
        this.getValue = infoValue.data;
      }
    } else {
      this.InfoValue = undefined;
    }
  }
}
