// angular
import { Component, ViewContainerRef } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
// models
import { ReceiveStock } from "../shared/receive-stock.model";
// components
import { BaseEditComponent } from "../../shared/base-edit-component";
// services
import { AuthService } from "../../core/auth/auth.service";
import { DialogsService } from "../../dialogs/shared/dialogs.service";
import { ReceiveStockService, ReceiveStockCommunicateService } from "../shared/receive-stock.service";

@Component({
  selector: 'app-receive-edit',
  templateUrl: './receive-edit.component.html',
  styleUrls: ['./receive-edit.component.scss']
})
export class ReceiveEditComponent extends BaseEditComponent<ReceiveStock, ReceiveStockService> {
  constructor(
    service: ReceiveStockService,
    serviceCom: ReceiveStockCommunicateService,
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
  onGetDataByKey(value?: ReceiveStock): void {
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
        ReceiveStockSpId: 0,
        Quantity: 0,
        ReceiveDate:new Date
      };
      this.buildForm();
    }
  }

  // build form
  buildForm(): void {
    // New form
    this.editValueForm = this.fb.group({
      ReceiveStockSpId: [this.editValue.ReceiveStockSpId],
      PurchaseOrder: [this.editValue.PurchaseOrder,
        [
          Validators.maxLength(50),
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
      ReceiveDate: [this.editValue.ReceiveDate,
        [
          Validators.required
        ]
      ],
      ReceiveEmp: [this.editValue.ReceiveEmp],
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
      ReceiveEmpString: [this.editValue.ReceiveEmpString,
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
                ReceiveEmp: emp.EmpCode,
                ReceiveEmpString: `คุณ${emp.NameThai}`,
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
