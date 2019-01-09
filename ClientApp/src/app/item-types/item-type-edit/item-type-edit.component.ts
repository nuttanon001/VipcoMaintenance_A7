// angular
import { Component, ViewContainerRef } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
// models
import { ItemType } from "../shared/item-type.model";
// components
import { BaseEditComponent } from "../../shared/base-edit-component";
// 3rd party
import { SelectItem } from "primeng/primeng";
// services
import { AuthService } from "../../core/auth/auth.service";
import { ShareService } from "../../shared/share.service";
import { DialogsService } from "../../dialogs/shared/dialogs.service";
import { ItemTypeService, ItemTypeCommunicateService } from "../shared/item-type.service";

@Component({
  selector: 'app-item-type-edit',
  templateUrl: './item-type-edit.component.html',
  styleUrls: ["../../shared/styles/edit2.style.scss"],
})
export class ItemTypeEditComponent extends BaseEditComponent<ItemType, ItemTypeService> {
  constructor(
    service: ItemTypeService,
    serviceCom: ItemTypeCommunicateService,
    private serviceShare: ShareService,
    private serviceAuth: AuthService,
    private serviceDialogs: DialogsService,
    private viewContainerRef: ViewContainerRef,
    private fb: FormBuilder
  ) {
    super(
      service,
      serviceCom,
    );
  }

  // Parameter

  // on get data by key
  onGetDataByKey(value?: ItemType): void {
    if (value) {
      this.service.getOneKeyNumber(value)
        .subscribe(dbData => {
          this.editValue = dbData;
        }, error => console.error(error), () => this.buildForm());
    } else {
      this.editValue = {
        ItemTypeId: 0,
      };

      this.serviceShare.getWorkGroup().subscribe(workgroup => {
        this.editValue.WorkGroupId = workgroup.WorkGroupId;
        if (this.editValueForm) {
          this.editValueForm.patchValue({
            WorkGroupId: this.editValue.WorkGroupId
          });
        }
      });

      this.buildForm();
    }
  }

  // build form
  buildForm(): void {
    this.editValueForm = this.fb.group({
      ItemTypeId: [this.editValue.ItemTypeId],
      Name: [this.editValue.Name,
        [
          Validators.required,
          Validators.maxLength(50)
        ]
      ],
      Description: [this.editValue.Description,
        [
          Validators.maxLength(200),
        ]
      ],
      Remark: [this.editValue.Remark,
        [
          Validators.maxLength(200),
        ]
      ],
      Creator: [this.editValue.Creator],
      CreateDate: [this.editValue.CreateDate],
      Modifyer: [this.editValue.Modifyer],
      ModifyDate: [this.editValue.ModifyDate],
      //FK
      WorkGroupId: [this.editValue.WorkGroupId]
    });

    this.editValueForm.valueChanges.subscribe((data: any) => this.onValueChanged(data));
  }
}
