// angular
import { Component, ViewContainerRef } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
// models
import { Workgroup } from "../shared/workgroup.model";
// components
import { BaseEditComponent } from "../../shared/base-edit-component";
// 3rd party
import { SelectItem } from "primeng/primeng";
// services
import { AuthService } from "../../core/auth/auth.service";
import { DialogsService } from "../../dialogs/shared/dialogs.service";
import { WorkGroupService, WorkGroupCommunicateService } from "../shared/work-group.service";

@Component({
  selector: 'app-work-group-edit',
  templateUrl: './work-group-edit.component.html',
  styleUrls: ["../../shared/styles/edit2.style.scss"],
})
export class WorkGroupEditComponent extends BaseEditComponent<Workgroup, WorkGroupService> {
  constructor(
    service: WorkGroupService,
    serviceCom: WorkGroupCommunicateService,
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
  onGetDataByKey(value?: Workgroup): void {
    if (value) {
      this.service.getOneKeyNumber(value)
        .subscribe(dbData => {
          this.editValue = dbData;
        }, error => console.error(error), () => this.buildForm());
    } else {
      this.editValue = {
        WorkGroupId: 0,
      };
      this.buildForm();
    }
  }

  // build form
  buildForm(): void {
    this.editValueForm = this.fb.group({
      WorkGroupId: [this.editValue.WorkGroupId],
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
          Validators.maxLength(200)
        ]
      ],
      Creator: [this.editValue.Creator],
      CreateDate: [this.editValue.CreateDate],
      Modifyer: [this.editValue.Modifyer],
      ModifyDate: [this.editValue.ModifyDate],
    });

    this.editValueForm.valueChanges.subscribe((data: any) => this.onValueChanged(data));
  }
}
