// angular
import { Component, Inject, ViewChild, OnDestroy } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
// models
import { Item } from "../../items/shared/item.model";
// service
import { ItemService } from "../../items/shared/item.service";
// rxjs
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
// base-component
import { BaseDialogComponent } from "../../shared/base-dialog.component";
import { ItemTypeService } from "../../item-types/shared/item-type.service";

@Component({
  selector: 'app-item-dialog',
  templateUrl: './item-dialog.component.html',
  styleUrls: ['./item-dialog.component.scss'],
  providers: [ItemService,ItemTypeService]
})
export class ItemDialogComponent extends BaseDialogComponent<Item, ItemService> {
  /** employee-dialog ctor */
  constructor(
    public service: ItemService,
    public dialogRef: MatDialogRef<ItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public mode: number
  ) {
    super(
      service,
      dialogRef
    );
  }
  // Parameter
  columns: Array<string> = ["select", "ItemCode", "Name", "ItemTypeString"];

  // on init
  onInit(): void {
    this.fastSelectd = this.mode === 0 ? true : false;
  }
}
