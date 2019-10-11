import { Component, OnInit, Inject } from '@angular/core';
import { BaseDialogEntryComponent } from 'src/app/shared2/baseclases/base-dialog-entry.component';
import { Item } from 'src/app/items/shared/item.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogInfo } from 'src/app/shared2/basemode/dialog-info.model';
import { ItemMk2Service } from 'src/app/items/shared/item-mk2.service';

@Component({
  selector: 'app-item-mk2-dialog',
  templateUrl: './item-mk2-dialog.component.html',
  styleUrls: ['./item-mk2-dialog.component.scss']
})

export class ItemMk2DialogComponent
  extends BaseDialogEntryComponent<Item, ItemMk2Service> {
  /** employee-dialog ctor */
  constructor(
    service: ItemMk2Service,
    public dialogRef: MatDialogRef<ItemMk2DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogInfo<Item>
  ) {
    super(
      service,
      dialogRef
    );
  }

  // on init
  onInit(): void {
    if (this.data) {
      this.fastSelectd = true;
    }
  }
}
