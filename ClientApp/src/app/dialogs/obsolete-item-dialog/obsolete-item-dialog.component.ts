// Angular Core
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// Components
import { BaseDialogEntryComponent } from 'src/app/shared2/baseclases/base-dialog-entry.component';
// Services
import { ObsoleteItemService } from 'src/app/obsolete-items/shared/obsolete-item.service';
import { ObsoleteItemCommunicateService } from 'src/app/obsolete-items/shared/obsolete-item-communicate.service';
// Models
import { DialogInfo } from 'src/app/shared2/basemode/dialog-info.model';
import { ObsoleteItem } from 'src/app/obsolete-items/shared/obsolete-item.model';

@Component({
  selector: 'app-obsolete-item-dialog',
  templateUrl: './obsolete-item-dialog.component.html',
  styleUrls: ['./obsolete-item-dialog.component.scss'],
  providers: [ ObsoleteItemService ]
})
export class ObsoleteItemDialogComponent
  extends BaseDialogEntryComponent<ObsoleteItem, ObsoleteItemService> {
  /** employee-dialog ctor */
  constructor(
    service: ObsoleteItemService,
    public dialogRef: MatDialogRef<ObsoleteItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogInfo<ObsoleteItem>
  ) {
    super(
      service,
      dialogRef
    );
  }

  // on init
  onInit(): void {
    if (!this.data) {
      this.onCancelClick();
    } else {
      // debug here
      // console.log("InfoData", JSON.stringify(this.data));

      if (this.data.info) {
        if (this.data.info.ItemId) {
          this.service.getByItem(this.data.info.ItemId)
            .subscribe(item => {
              this.InfoValue = item;
            });
        }
      }
    }
  }
}
