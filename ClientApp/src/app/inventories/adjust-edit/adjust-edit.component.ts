// angular
import { Component, ViewContainerRef } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
// models
import { AdjustStock } from "../shared/adjust-stock.model";
// components
import { BaseEditComponent } from "../../shared/base-edit-component";
// services
import { AuthService } from "../../core/auth/auth.service";
import { DialogsService } from "../../dialogs/shared/dialogs.service";
import { AdjustStockService, AdjustStockCommunicateService } from "../shared/adjust-stock.service";

@Component({
  selector: 'app-adjust-edit',
  templateUrl: './adjust-edit.component.html',
  styleUrls: ['./adjust-edit.component.scss']
})
export class AdjustEditComponent extends BaseEditComponent<AdjustStock, AdjustStockService> {
  constructor(
    service: AdjustStockService,
    serviceCom: AdjustStockCommunicateService,
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
  onGetDataByKey(value?: AdjustStock): void {
    if (value) {
      this.service.getOneKeyNumber(value)
        .subscribe(dbData => {
          if (dbData) {
            this.editValue = dbData;
          }
        }, error => console.error(error), () => {
          this.buildForm();
        });
    } else {
      this.editValue = {
        AdjustStockSpId: 0,
        Quantity: 0,
        AdjustDate: new Date
      };
      this.buildForm();
    }
  }

  // build form
  buildForm(): void {
    // New form
    this.editValueForm = this.fb.group({
      AdjustStockSpId: [this.editValue.AdjustStockSpId],
      Description: [this.editValue.Description,
        [
          Validators.maxLength(250),
        ]
      ],
      Remark: [this.editValue.Remark,
        [
          Validators.maxLength(250),
        ]
      ],
      Quantity: [this.editValue.Quantity,
        [
          Validators.required,
          Validators.min(0)
        ]
      ],
      AdjustDate: [this.editValue.AdjustDate,
        [
          Validators.required
        ]
      ],
      EmpCode: [this.editValue.EmpCode],
      SparePartId: [this.editValue.SparePartId],
      MovementStockSpId: [this.editValue.MovementStockSpId],
      // BaseModel
      Creator: [this.editValue.Creator],
      CreateDate: [this.editValue.CreateDate],
      Modifyer: [this.editValue.Modifyer],
      ModifyDate: [this.editValue.ModifyDate],
      // ViewModel
      SparePartName: [this.editValue.SparePartName,
        [
          Validators.required,
        ]
      ],
      AdjustEmpString: [this.editValue.AdjustEmpString,
        [
          Validators.required
        ]
      ],
    });
    this.editValueForm.valueChanges.subscribe((data: any) => this.onValueChanged(data));
  }

  // open dialog
  openDialog(type?: string): void {
    if (type) {
      if (type === "Employee") {
        this.serviceDialogs.dialogSelectEmployee(this.viewContainerRef)
          .subscribe(emp => {
            if (emp) {
              this.editValueForm.patchValue({
                EmpCode: emp.EmpCode,
                AdjustEmpString: `คุณ${emp.NameThai}`,
              });
            }
          });
      } else if (type === "SparePart") {
        this.serviceDialogs.dialogSelectSparePart(this.viewContainerRef)
          .subscribe(spare => {
            if (spare) {
              this.editValueForm.patchValue({
                SparePartId: spare.SparePartId,
                SparePartName: spare.Name
              });
            }
          });
      }
    }
  }
}
