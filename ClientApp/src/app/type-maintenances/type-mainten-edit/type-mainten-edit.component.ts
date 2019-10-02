// angular
import { Component, ViewContainerRef } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
// models
import { TypeMaintenance } from "../shared/type-maintenance.model";
import { Workgroup } from "../../work-groups/shared/workgroup.model";
import { ItemType } from "../../item-types/shared/item-type.model";
// components
import { BaseEditComponent } from "../../shared/base-edit-component";
// 3rd party
import { SelectItem } from "primeng/primeng";
// services
import { AuthService } from "../../core/auth/auth.service";
import { DialogsService } from "../../dialogs/shared/dialogs.service";
import { ShareService } from "../../shared/share.service";
import { TypeMaintenService, TypeMaintenCommunicateService } from "../shared/type-mainten.service";
import { ItemTypeService } from "../../item-types/shared/item-type.service";

@Component({
  selector: "app-type-mainten-edit",
  templateUrl: "./type-mainten-edit.component.html",
  styleUrls: ["./type-mainten-edit.component.scss"],
})

export class TypeMaintenEditComponent
  extends BaseEditComponent<TypeMaintenance, TypeMaintenService> {
  constructor(
    service: TypeMaintenService,
    serviceCom: TypeMaintenCommunicateService,
    private serviceShare: ShareService,
    private serviceItemType: ItemTypeService,
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
  workGroup: Workgroup;
  itemTypes: Array<ItemType>;
  // on get data by key
  onGetDataByKey(value?: TypeMaintenance): void {
    // WorkGroup
    this.serviceShare.getWorkGroup().subscribe(workgroup => {
      if (workgroup) {
        this.workGroup = {
          WorkGroupId: workgroup.WorkGroupId
        };
      }
    });

    if (value) {
      this.service.getOneKeyNumber(value)
        .subscribe(dbData => {
          this.editValue = dbData;
        }, error => console.error(error), () => this.buildForm());
    } else {
      this.editValue = {
        TypeMaintenanceId: 0,
      };
      this.buildForm();
    }
  }

  // build form
  buildForm(): void {
    //GetData
    this.getItemType();

    this.editValueForm = this.fb.group({
      TypeMaintenanceId: [this.editValue.TypeMaintenanceId],
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
      ItemTypeId: [this.editValue.ItemTypeId,
        [
          Validators.required
        ]
      ],
      Creator: [this.editValue.Creator],
      CreateDate: [this.editValue.CreateDate],
      Modifyer: [this.editValue.Modifyer],
      ModifyDate: [this.editValue.ModifyDate],
    });

    this.editValueForm.valueChanges.subscribe((data: any) => this.onValueChanged(data));
  }

  // get item type
  getItemType(): void {
    if (!this.itemTypes) {
      this.itemTypes = new Array;
    }
    if (this.workGroup) {
      this.serviceItemType.getAll()
        .subscribe(dbItemType => {
          if (dbItemType) {
            this.itemTypes = dbItemType.filter((item: ItemType) =>
              item.WorkGroupId === this.workGroup.WorkGroupId).slice();
          }
        });
    }
  }
}
