// Angular Core
import { Component, OnInit } from '@angular/core';
// Components
import { BaseInfoDialogComponent } from 'src/app/shared2/baseclases/base-info-dialog-component';
// Models
import { AttachFile } from 'src/app/obsolete-items/shared/attach-file.model';
import { ObsoleteItem } from 'src/app/obsolete-items/shared/obsolete-item.model';
import { typeField, inputType } from 'src/app/shared2/dynamic-form/field-config.model';
// Services
import { ItemService } from 'src/app/items/shared/item.service';
import { ObsoleteItemService } from 'src/app/obsolete-items/shared/obsolete-item.service';
import { ItemHistories } from 'src/app/items/shared/item-histories.model';

@Component({
  selector: 'app-obsolete-item-info-dialog',
  templateUrl: './obsolete-item-info-dialog.component.html',
  styleUrls: ['./obsolete-item-info-dialog.component.scss']
})
export class ObsoleteItemInfoDialogComponent
  extends BaseInfoDialogComponent<ObsoleteItem> {

  constructor(
    private service: ObsoleteItemService,
    private serviceItem:ItemService
  ) { super(); }

  ItemImage?: string;
  ItemHistories?: Array<ItemHistories>;

  ngOnInit(): void {
    if (this.InfoValue) {
      this.service.getAttachFile(this.InfoValue.ObsoleteItemId)
        .subscribe((dbAttachs: Array<AttachFile>) => {
          if (dbAttachs) {
            if (dbAttachs[0]) {
              this.ItemImage = dbAttachs[0].FileAddress;
            }
          }
        });
    }
    // Override
    super.ngOnInit();
    this.getItemHistories();
  }
  // BuildForm
  buildForm(): void {
    this.regConfig = [
      {
        type: typeField.date,
        label: "Obsolete Date",
        name: "ObsoleteDate",
        readonly: true,
        value: this.InfoValue.ObsoleteDate,
      },

      {
        type: typeField.input,
        label: "Doc No.",
        inputType: inputType.text,
        name: "ObsoleteNo",
        readonly: true,
        value: this.InfoValue.ObsoleteNo,
      },

      {
        type: typeField.inputclick,
        label: "Tool/Machine Name.",
        inputType: inputType.text,
        name: "Name",
        readonly: true,
        value: this.InfoValue.ItemName,
      },

      {
        type: typeField.inputclick,
        label: "Tool/Machine No.",
        inputType: inputType.text,
        name: "ItemCode",
        readonly: true,
        value: this.InfoValue.ItemCode,
      },

      {
        type: typeField.date,
        label: "Register Date",
        name: "RegisterDate",
        readonly: true,
        value: this.InfoValue.RegisterDate,
      },

      {
        type: typeField.input,
        label: "S/N",
        inputType: inputType.text,
        name: "Property",
        readonly: true,
        value: this.InfoValue.SerialNumber,
      },

      {
        type: typeField.input,
        label: "Lifetime",
        inputType: inputType.text,
        name: "Lifetime",
        readonly: true,
        value: this.InfoValue.Lifetime,
      },

      {
        type: typeField.input,
        label: "FixedAsset",
        inputType: inputType.number,
        name: "FixedAsset",
        readonly: true,
        value: this.InfoValue.FixedAsset,
      },

      {
        type: typeField.input,
        label: "WorkGroup",
        inputType: inputType.text,
        name: "GroupMisString",
        readonly: true,
        value: this.InfoValue.WorkGroup,
      },

      {
        type: typeField.textarea,
        label: "Obsolete Description",
        name: "Description",
        readonly: true,
        value: this.InfoValue.Description,
      },

      {
        type: typeField.input,
        label: "Reviewed By Level 1",
        inputType: inputType.text,
        name: "Approve1NameThai",
        readonly: true,
        value: this.InfoValue.Approve1NameThai,
      },
      //-----------------------------------------------------------------//

      {
        type: typeField.inputclick,
        label: "Obsolete By",
        name: "RequestNameThai",
        readonly: true,
        value: this.InfoValue.RequestNameThai,
      },

      {
        type: typeField.input,
        label: "Reviewed By Level 2",
        inputType: inputType.text,
        name: "Approve2NameThai",
        readonly: true,
        value: this.InfoValue.Approve2NameThai,
      },

      //-----------------------------------------------------------------//

      {
        type: typeField.textarea,
        label: "Remark",
        name: "Remark",
        readonly: true,
        value: this.InfoValue.Remark,
      },

      {
        type: typeField.empty
      },

      {
        type: typeField.input,
        label: "Approved By",
        inputType: inputType.text,
        name: "ComplateByNameThai",
        readonly: true,
        value: this.InfoValue.ComplateByNameThai,
      },
    ];
  }

  // Get item histories
  getItemHistories(): void {
    if (this.InfoValue) {
      if (this.InfoValue.ItemId) {
        this.serviceItem.getItemHistories2(this.InfoValue.ItemId)
          .subscribe((itemHistories: Array<ItemHistories>) => {
            if (itemHistories) {
              this.ItemHistories = itemHistories.slice();
            }
          });
      }
    }
  }
}
