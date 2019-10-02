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
export abstract class BaseDialogEntryComponent<Model extends BaseModel, Service extends BaseRestService<Model>> implements OnInit {
  getValue: Model;
  getValues: Array<Model>;
  fastSelectd: boolean = false;
  /** cutting-plan-dialog ctor */
  constructor(
    protected service: Service,
    protected dialogRef: MatDialogRef<any>
  ) { }

  // Parameter
  InfoValue: Model;

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

  // on new entity
  // abstract onNewEntity(): void;

  // on complate or cancel entity
  onComplateOrCancelEntity(infoValue?: { data: Model | undefined, force: boolean }): void {
    if (infoValue) {
      if (infoValue.data.CreateDate) {
        this.service.updateModelWithKey(infoValue.data)
          .subscribe(dbData => {
            if (dbData) {
              if (this.fastSelectd) {
                this.dialogRef.close(dbData);
              } else {
                this.dialogRef.close([dbData]);
              }
            }
          });
      } else {
        this.service.addModel(infoValue.data)
          .subscribe(dbData => {
            if (dbData) {
              if (this.fastSelectd) {
                this.dialogRef.close(dbData);
              } else {
                this.dialogRef.close([dbData]);
              }
            }
          });
      }
    } else {
      this.InfoValue = undefined;
    }
  }

  // on info
  onInfoComplate(infoValue?: { data: Model | undefined, force: boolean }): void {
    if (infoValue) {
      if (this.fastSelectd) {
        if (infoValue.force) {
          this.dialogRef.close(infoValue.data);
        } else {
          this.getValue = infoValue.data;
        }
      } else {
        if (infoValue.force) {
          this.dialogRef.close([infoValue.data]);
        } else {
          this.getValues = [infoValue.data];
        }
      }
    } else {
      this.InfoValue = undefined;
    }
  }

  // on detail view
  onEditInfo(value?: { data: Model, option: number }): void {
    if (value) {
      if (value.option === 1) {
        this.InfoValue = value.data;
      }
    }
  }
}
