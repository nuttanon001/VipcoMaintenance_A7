// angular
import { Component, ViewContainerRef } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
// models
import { WorkGroupMaintenance } from "../shared/work-group-maintenance";
// components
import { BaseEditComponent } from "../../shared/base-edit-component";
// 3rd party
import { SelectItem } from "primeng/primeng";
// services
import { AuthService } from "../../core/auth/auth.service";
import { DialogsService } from "../../dialogs/shared/dialogs.service";
import { WorkGroupMaintenCommunicateService, WorkGroupMaintenService } from "../shared/work-group-mainten.service";

@Component({
  selector: 'app-work-group-mainten-edit',
  templateUrl: './work-group-mainten-edit.component.html',
  styleUrls: ['./work-group-mainten-edit.component.scss']
})
export class WorkGroupMaintenEditComponent extends BaseEditComponent<WorkGroupMaintenance, WorkGroupMaintenService> {
  constructor(
    service: WorkGroupMaintenService,
    serviceCom: WorkGroupMaintenCommunicateService,
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
  onGetDataByKey(value?: WorkGroupMaintenance): void {
    if (value) {
      this.service.getOneKeyNumber(value)
        .subscribe(dbData => {
          this.editValue = dbData;
        }, error => console.error(error), () => this.buildForm());
    } else {
      this.editValue = {
        WorkGroupMaintenanceId: 0,
      };
      this.buildForm();
    }
  }

  // build form
  buildForm(): void {
    this.editValueForm = this.fb.group({
      WorkGroupMaintenanceId: [this.editValue.WorkGroupMaintenanceId],
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
