import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
// models
import { Scroll } from "./scroll.model";
// rxjs
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
// 3rd party

/** base-dialog component*/
export abstract class BaseDialogComponent<Model, Service> implements OnInit {
  getValue: Model;
  getValues: Array<Model>;
  fastSelectd: boolean = false;
  /** cutting-plan-dialog ctor */
  constructor(
    protected service: Service,
    protected dialogRef: MatDialogRef<any>
  ) { }

  /** Called by Angular after cutting-plan-dialog component initialized */
  ngOnInit(): void {
    this.onInit();
  }

  // on Init data
  abstract onInit(): void;

  // Selected Value
  onSelectedValue(value?: Model): void {
    // console.log("OnSelectedValue", JSON.stringify(value));
    if (value) {
      this.getValue = value;
      if (this.fastSelectd) {
        this.onSelectedClick();
      }
    }
  }

  onSelectedValues(values?: Array<Model>): void {
    if (values) {
      this.getValues = values.slice();
    }
  }

  // No Click
  onCancelClick(): void {
    this.dialogRef.close();
  }

  // Update Click
  onSelectedClick(): void {
    if (this.getValue) {
      this.dialogRef.close(this.getValue);
    } else if (this.getValues) {
      this.dialogRef.close(this.getValues);
    }
  }
}
