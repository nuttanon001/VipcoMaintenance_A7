// angular
import { Component, ViewContainerRef } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  Validators,
  AbstractControl,
} from "@angular/forms";
// models
import {
  ItemMaintenance,
  StatusMaintenance,
} from "../shared/item-maintenance.model";
import {
  RequireMaintenance,
  RequireStatus,
} from "../../require-maintenances/shared/require-maintenance.model";
import { TypeMaintenance } from "../../type-maintenances/shared/type-maintenance.model";
import { RequisitionStock } from "../../inventories/shared/requisition-stock.model";
import { WorkGroupMaintenance } from "../../work-group-maintenances/shared/work-group-maintenance";
// components
import { BaseEditComponent } from "../../shared/base-edit-component";
// services
import { AuthService } from "../../core/auth/auth.service";
import { DialogsService } from "../../dialogs/shared/dialogs.service";
import { TypeMaintenService } from "../../type-maintenances/shared/type-mainten.service";
import { RequisitionStockService } from "../../inventories/shared/requisition-stock.service";
import { RequireMaintenService } from "../../require-maintenances/shared/require-mainten.service";
import {
  ItemMaintenService,
  ItemMaintenCommunicateService,
} from "../shared/item-mainten.service";
import { WorkGroupMaintenService } from "../../work-group-maintenances/shared/work-group-mainten.service";
import { ItemMaintenHasEmpService } from "../shared/item-mainten-has-emp.service";
import { ItemMaintenanceHasEmp } from "../shared/item-maintenance-has-emp.model";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from "rxjs/operators";
import { of } from "rxjs";

@Component({
  selector: "app-item-mainten-edit",
  templateUrl: "./item-mainten-edit.component.html",
  styleUrls: ["./item-mainten-edit.component.scss"],
})
export class ItemMaintenEditComponent extends BaseEditComponent<
  ItemMaintenance,
  ItemMaintenService
> {
  constructor(
    service: ItemMaintenService,
    serviceCom: ItemMaintenCommunicateService,
    private serviceItemMainEmp: ItemMaintenHasEmpService,
    private serviceGroupMainten: WorkGroupMaintenService,
    private serviceRequireMainten: RequireMaintenService,
    private serviceRequisitionStock: RequisitionStockService,
    private serviceTypeMainten: TypeMaintenService,
    private serviceAuth: AuthService,
    private serviceDialogs: DialogsService,
    private viewContainerRef: ViewContainerRef,
    private fb: FormBuilder
  ) {
    super(service, serviceCom);
  }

  // Parameter
  requireMainten: RequireMaintenance;
  typeMaintenances: Array<TypeMaintenance>;
  groupMaintenances: Array<WorkGroupMaintenance>;
  requisition: RequisitionStock;
  indexItem: number;
  toDay: Date = new Date();
  isReadOnly?: boolean = false;
  // Property
  get ReadOnlyControl(): boolean {
    if (this.editValue) {
      if (this.editValue.ItemMaintenanceId > 0) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }
  // on get data by key
  onGetDataByKey(value?: ItemMaintenance): void {
    if (value && value.ItemMaintenanceId) {
      this.service
        .getOneKeyNumber(value)
        .pipe(
          catchError(() => of({ ItemMaintenanceId: 0 } as ItemMaintenance)),
          switchMap((dbData: ItemMaintenance) => {
            if (dbData) {
              this.editValue = dbData;
              this.editValue.RequisitionStockSps = new Array();
              this.editValue.ItemMainHasEmployees = new Array();
              //Set read only for form
              if (this.editValue.StatusMaintenance === StatusMaintenance.Complate) {
                this.isReadOnly = true;
              }

              return this.serviceRequisitionStock.getRequisitionByItemMaintenance(this.editValue.ItemMaintenanceId);
            } else {
              return of(undefined);
            }
          }),
          catchError(() => of([])),
          switchMap((dbRequisition: RequisitionStock[]) => {
            if (dbRequisition) {
              dbRequisition.forEach((item) => {
                let temp: RequisitionStock = {
                  RequisitionStockSpId: 0,
                  RequisitionDate: new Date(),
                  Quantity: 1,
                };
                // loop deep clone without $id don't need it
                for (let key in item) {
                  if (key.indexOf("$id") === -1) {
                    temp[key] = item[key];
                  }
                }
                this.editValue.RequisitionStockSps.push(temp);
              });
              this.editValue.RequisitionStockSps = this.editValue.RequisitionStockSps.slice();
            }

            if (this.editValue.ItemMaintenanceId) {
              return  this.serviceItemMainEmp.actionItemMaintenanceHasEmployee(this.editValue.ItemMaintenanceId);
            } else {
              return of([]);
            }
          }),
          catchError(() => of([])),
          switchMap((ItemMainHasEmp: ItemMaintenanceHasEmp[]) => {
            if (ItemMainHasEmp) {
              ItemMainHasEmp.forEach((item) => {
                let temp2: ItemMaintenanceHasEmp = {
                  ItemMainHasEmployeeId: 0,
                };

                // loop deep clone without $id don't need it
                for (let key in item) {
                  if (key.indexOf("$id") === -1) {
                    temp2[key] = item[key];
                  }
                }
                this.editValue.ItemMainHasEmployees.push(temp2);
              });
              this.editValue.RequisitionStockSps = this.editValue.RequisitionStockSps.slice();
            }
            return this.serviceGroupMainten.getAll();
          }),
          catchError(() => of([])),
          switchMap((mainGroups: WorkGroupMaintenance[]) => {
            if (mainGroups) {
              this.groupMaintenances = mainGroups
                .sort((item1, item2) => {
                  if (item1.Name > item2.Name) {
                    return 1;
                  }
                  if (item1.Name < item2.Name) {
                    return -1;
                  }
                  return 0;
                }).slice();
            }

            if (this.editValue.RequireMaintenanceId) {
              return  this.serviceRequireMainten.getOneKeyNumber({ RequireMaintenanceId: this.editValue.RequireMaintenanceId,});
            } else {
              return of(undefined);
            }
          }),
          catchError(() => of(undefined)),
          switchMap((dbDataReq: RequireMaintenance) => {
            if (dbDataReq) {
              this.requireMainten = dbDataReq;
            }
            return this.serviceTypeMainten.getAll();
          }),
          catchError(() => of([])),
          map((dbMainType: TypeMaintenance[]) => {
            if (dbMainType) {
              this.typeMaintenances = dbMainType
                .sort((item1, item2) => {
                  if (item1.Name > item2.Name) {
                    return 1;
                  }
                  if (item1.Name < item2.Name) {
                    return -1;
                  }
                  return 0;
                }).slice();
            }
          })
        ).subscribe(() => {}, (error) => console.error(error),() => {this.buildForm();
            /*
          if (this.editValue.RequireMaintenanceId) {
            this.serviceRequireMainten.getOneKeyNumber({ RequireMaintenanceId: this.editValue.RequireMaintenanceId })
              .subscribe(dbDataReq => {
                if (dbDataReq) {
                  this.requireMainten = dbDataReq;
                  if (!this.typeMaintenances) {
                    this.getTypeMaintenances();
                  } else if (this.typeMaintenances.length < 1) {
                    this.getTypeMaintenances();
                  }
                }
              });
          }
          */
          }
        );
    } else {
      this.editValue = {
        ItemMaintenanceId: 0,
        RequisitionStockSps: new Array(),
        ItemMainHasEmployees: new Array(),
        StatusMaintenance: StatusMaintenance.TakeAction,
        Description: "-",
      };

      if (value) {
        if (value.RequireMaintenanceId) {
          this.editValue.RequireMaintenanceId = value.RequireMaintenanceId;
          this.serviceRequireMainten
            .getOneKeyNumber({
              RequireMaintenanceId: this.editValue.RequireMaintenanceId,
            })
            .subscribe((dbData) => {
              if (dbData) {
                this.requireMainten = dbData;
                if (!this.typeMaintenances) {
                  this.getTypeMaintenances();
                } else if (this.typeMaintenances.length < 1) {
                  this.getTypeMaintenances();
                }
              }
            });
        }
      }
      this.buildForm();
    }
  }

  // build form
  buildForm(): void {
    // Get group maintenances
    this.getGroupMaintenances();
    // Get type maintenances
    this.getTypeMaintenances();
    // New form
    this.editValueForm = this.fb.group({
      // [{value: 'someValue', disabled:true}]
      ItemMaintenanceId: [
        { value: this.editValue.ItemMaintenanceId, disabled: this.isReadOnly },
      ],
      ItemMaintenanceNo: [
        { value: this.editValue.ItemMaintenanceNo, disabled: this.isReadOnly },
      ],
      PlanStartDate: [
        { value: this.editValue.PlanStartDate, disabled: this.isReadOnly },
        [Validators.required],
      ],
      PlanEndDate: [
        { value: this.editValue.PlanEndDate, disabled: this.isReadOnly },
        [Validators.required],
      ],
      ActualStartDate: [
        { value: this.editValue.ActualStartDate, disabled: this.isReadOnly },
      ],
      ActualStartDateTime: [
        {
          value: this.editValue.ActualStartDateTime,
          disabled: this.isReadOnly,
        },
      ],
      ActualEndDate: [
        { value: this.editValue.ActualEndDate, disabled: this.isReadOnly },
      ],
      ActualEndDateTime: [
        { value: this.editValue.ActualEndDateTime, disabled: this.isReadOnly },
      ],
      StatusMaintenance: [
        { value: this.editValue.StatusMaintenance, disabled: this.isReadOnly },
      ],
      Description: [
        this.editValue.Description,
        [Validators.required, Validators.maxLength(500)],
      ],
      Remark: [this.editValue.Remark, [Validators.maxLength(200)]],
      MaintenanceEmp: [
        { value: this.editValue.MaintenanceEmp, disabled: this.isReadOnly },
      ],
      RequireMaintenanceId: [
        {
          value: this.editValue.RequireMaintenanceId,
          disabled: this.isReadOnly,
        },
      ],
      TypeMaintenanceId: [
        { value: this.editValue.TypeMaintenanceId, disabled: this.isReadOnly },
        [Validators.required],
      ],
      RequisitionStockSps: [
        {
          value: this.editValue.RequisitionStockSps,
          disabled: this.isReadOnly,
        },
      ],
      ItemMainHasEmployees: [
        {
          value: this.editValue.ItemMainHasEmployees,
          disabled: this.isReadOnly,
        },
      ],
      WorkGroupMaintenanceId: [
        {
          value: this.editValue.WorkGroupMaintenanceId,
          disabled: this.isReadOnly,
        },
        [Validators.required],
      ],
      // BaseModel
      Creator: [this.editValue.Creator],
      CreateDate: [this.editValue.CreateDate],
      Modifyer: [this.editValue.Modifyer],
      ModifyDate: [this.editValue.ModifyDate],
      // ViewModel
      ItemCode: [{ value: this.editValue.ItemCode, disabled: this.isReadOnly }],
      MaintenanceEmpString: [
        {
          value: this.editValue.MaintenanceEmpString,
          disabled: this.isReadOnly,
        },
      ],
      TypeMaintenanceString: [
        {
          value: this.editValue.TypeMaintenanceString,
          disabled: this.isReadOnly,
        },
      ],
      StatusMaintenanceString: [
        {
          value: this.editValue.StatusMaintenanceString,
          disabled: this.isReadOnly,
        },
      ],
    });
    this.editValueForm.valueChanges.subscribe((data: any) =>
      this.onValueChanged(data)
    );

    const controlAS: AbstractControl | null =
      this.editValueForm.get("ActualStartDate");
    if (controlAS) {
      controlAS.valueChanges
        .pipe(debounceTime(500), distinctUntilChanged())
        .subscribe((data: any) => {
          const controlASTime: AbstractControl = this.editValueForm.get(
            "ActualStartDateTime"
          );
          if (controlASTime) {
            controlASTime.setValidators(
              data ? Validators.required : Validators.nullValidator
            );
            controlASTime.updateValueAndValidity();

            if (this.editValueForm) {
              Object.keys(this.editValueForm.controls).forEach((field) => {
                const control = this.editValueForm.get(field);
                control.markAsTouched({ onlySelf: true });
              });
            }
          }
        });
    }

    const controlAE: AbstractControl | null =
      this.editValueForm.get("ActualEndDate");
    if (controlAE) {
      controlAE.valueChanges
        .pipe(debounceTime(500), distinctUntilChanged())
        .subscribe((data: any) => {
          const controlAETime: AbstractControl =
            this.editValueForm.get("ActualEndDateTime");
          if (controlAETime) {
            controlAETime.setValidators(
              data ? Validators.required : Validators.nullValidator
            );
            controlAETime.updateValueAndValidity();

            if (this.editValueForm) {
              Object.keys(this.editValueForm.controls).forEach((field) => {
                const control = this.editValueForm.get(field);
                control.markAsTouched({ onlySelf: true });
              });
            }
          }
        });
    }
  }

  //============= OverRide ===============//
  // on value of form change
  onValueChanged(data?: any): void {
    if (!this.editValueForm) {
      return;
    }
    const form = this.editValueForm;
    //Get Control
    const controlAS: AbstractControl | null = form.get("ActualStartDate");
    const controlAE: AbstractControl | null = form.get("ActualEndDate");

    if (controlAS && controlAE) {
      // console.log("Control1");
      if (controlAS.value && controlAE.value) {
        // console.log("Control2");
        if (controlAS.value > controlAE.value) {
          this.editValueForm.patchValue({
            ActualStartDate: controlAE.value,
          });
        } else if (controlAE.value < controlAS.value) {
          this.editValueForm.patchValue({
            ActualEndDate: controlAS.value,
          });
        }
      } else {
        if (!controlAS.value) {
          if (controlAE.value) {
            // debug here
            // console.log("controlAE", JSON.stringify(controlAE.value));

            this.editValueForm.patchValue({
              ActualStartDate: controlAE.value,
            });
          }
        }
      }
    }

    super.onValueChanged();
  }
  //============= OverRide ===============//

  // get type maintenance
  getTypeMaintenances(): void {
    if (!this.typeMaintenances) {
      this.typeMaintenances = new Array();

      this.serviceTypeMainten.getAll().subscribe((dbData) => {
        if (dbData) {
          // this.typeMaintenances = [...dbData];
          this.typeMaintenances = dbData
            .sort((item1, item2) => {
              if (item1.Name > item2.Name) {
                return 1;
              }
              if (item1.Name < item2.Name) {
                return -1;
              }
              return 0;
            })
            .slice();
        }
      });
      /*
      if (this.requireMainten) {

      }
      */
    }
  }

  // get group maintenance
  getGroupMaintenances(): void {
    if (!this.groupMaintenances) {
      this.groupMaintenances = new Array();

      this.serviceGroupMainten.getAll().subscribe((dbData) => {
        if (dbData) {
          //this.groupMaintenances = [...dbData];
          this.groupMaintenances = dbData
            .sort((item1, item2) => {
              if (item1.Name > item2.Name) {
                return 1;
              }
              if (item1.Name < item2.Name) {
                return -1;
              }
              return 0;
            })
            .slice();
        }
      });
    }
  }

  // open dialog
  openDialog(type?: string): void {
    if (type) {
      if (type === "Employee") {
        this.serviceDialogs
          .dialogSelectEmployee(this.viewContainerRef)
          .subscribe((emp) => {
            if (emp) {
              this.editValueForm.patchValue({
                MaintenanceEmp: emp.EmpCode,
                MaintenanceEmpString: `คุณ${emp.NameThai}`,
              });
            }
          });
      } else if (type === "RequireMaintenance") {
        this.serviceDialogs.dialogSelectRequireMaintenance(
          this.requireMainten.RequireMaintenanceId,
          this.viewContainerRef,
          false
        );
      } else if (type === "Employees") {
        // New Array
        if (!this.editValue.ItemMainHasEmployees) {
          this.editValue.ItemMainHasEmployees = new Array();
        }
        this.serviceDialogs
          .dialogSelectEmployees(this.viewContainerRef, 1)
          .subscribe((Employees) => {
            if (Employees) {
              Employees.forEach((item, index) => {
                if (
                  !this.editValue.ItemMainHasEmployees.find(
                    (itemEmp) => itemEmp.EmpCode === item.EmpCode
                  )
                ) {
                  this.editValue.ItemMainHasEmployees.push({
                    EmpCode: item.EmpCode,
                    ItemMainEmpString: item.NameThai,
                    ItemMaintenanceId: this.editValue.ItemMaintenanceId,
                    ItemMainHasEmployeeId: 0,
                  });
                }
              });

              this.editValue.ItemMainHasEmployees =
                this.editValue.ItemMainHasEmployees.slice();
              // Update to form
              this.editValueForm.patchValue({
                ItemMainHasEmployees: this.editValue.ItemMainHasEmployees,
              });
              this.onValueChanged();
            }
          });
      }
    }
  }

  // action Requisition add | edit
  actionRequisition(anyData?: { data: RequisitionStock; mode: number }): void {
    if (!anyData) {
      this.requisition = {
        RequisitionStockSpId: 0,
        RequisitionDate: new Date(),
        Quantity: 1,
        ItemMaintenanceId: this.editValue.ItemMaintenanceId,
      };
      this.indexItem = -1;
    } else {
      this.indexItem = this.editValue.RequisitionStockSps.indexOf(anyData.data);
      if (anyData.mode === 1) {
        this.requisition = anyData.data;
      } else {
        this.editValue.RequisitionStockSps.splice(this.indexItem, 1);
        this.editValue.RequisitionStockSps =
          this.editValue.RequisitionStockSps.slice();
        // Update to form
        this.editValueForm.patchValue({
          RequisitionStockSps: this.editValue.RequisitionStockSps,
        });
      }
    }
  }

  // Requisition complate or cancel
  onComplateOrCancel(requisition?: RequisitionStock): void {
    if (requisition) {
      if (this.indexItem > -1) {
        // remove item
        this.editValue.RequisitionStockSps.splice(this.indexItem, 1);
      }
      // cloning an object
      this.editValue.RequisitionStockSps.push(Object.assign({}, requisition));
      this.editValue.RequisitionStockSps =
        this.editValue.RequisitionStockSps.slice();
      // Update to form
      this.editValueForm.patchValue({
        RequisitionStockSps: this.editValue.RequisitionStockSps,
      });
      this.onValueChanged();
    }
    this.requisition = undefined;
    this.onValueChanged();
  }

  // ItemEmployee remove
  onItemMaintenanceEmployeeRemove(anyData?: {
    data: ItemMaintenanceHasEmp;
    option: number;
  }): void {
    // console.log("Data is", JSON.stringify(anyData));
    if (anyData) {
      if (anyData.option === 0) {
        // Found Index
        let indexItem: number = this.editValue.ItemMainHasEmployees.indexOf(
          anyData.data
        );
        // Remove at Index
        this.editValue.ItemMainHasEmployees.splice(indexItem, 1);
        // Angular need change data for update view
        this.editValue.ItemMainHasEmployees =
          this.editValue.ItemMainHasEmployees.slice();
        // Update to form
        this.editValueForm.patchValue({
          ItemMainHasEmployees: this.editValue.ItemMainHasEmployees,
        });
      }
    }
  }

  // on valid data
  onFormValid(isValid: boolean): void {
    this.editValue = this.editValueForm.getRawValue();
    this.communicateService.toParent([this.editValue, isValid]);
  }
}
