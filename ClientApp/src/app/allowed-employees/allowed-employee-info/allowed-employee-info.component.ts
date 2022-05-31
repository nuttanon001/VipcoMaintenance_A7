import { Validators } from '@angular/forms';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
// Components
import { BaseInfoComponent } from 'src/app/shared2/baseclases/base-info-component';
// Models
import { AllowedEmployee } from '../shared/allowed-employee.model';
import { Employee } from 'src/app/employees/shared/employee.model';
import { OptionField, typeField, inputType, ValidatorField, ReturnValue } from 'src/app/shared2/dynamic-form/field-config.model';
// Services
import { ShareService } from 'src/app/shared2/share.service';
import { DialogsService } from 'src/app/dialogs/shared/dialogs.service';
import { EmployeeService } from 'src/app/employees/shared/employee.service';
import { AllowedEmployeeService } from '../shared/allowed-employee.service';
import { AllowedEmployeeCommunicateService } from '../shared/allowed-employee-communicate.service';
// Rxjs
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-allowed-employee-info',
  templateUrl: './allowed-employee-info.component.html',
  styleUrls: ['./allowed-employee-info.component.scss']
})
export class AllowedEmployeeInfoComponent
  extends BaseInfoComponent<AllowedEmployee, AllowedEmployeeService, AllowedEmployeeCommunicateService> {

  constructor(
    service: AllowedEmployeeService,
    serviceCom: AllowedEmployeeCommunicateService,
    private serviceEmp: EmployeeService,
    private serviceShared: ShareService,
    private serviceDialogs: DialogsService,
    private viewCon: ViewContainerRef,
  ) { super(service, serviceCom) }

  // Parameters
  optionLevel: Array<OptionField>;

  // Methods
  onGetDataByKey(InfoValue: AllowedEmployee): void {
    this.optionLevelMethod();

    if (InfoValue && InfoValue.EmpCode) {
      // if set copy
      this.isCopying = InfoValue.Copying;

      this.service.getOneKeyNumber(InfoValue)
        .pipe(switchMap((dbData) => {
          this.InfoValue = dbData;
          this.isValid = true;

          if (dbData.EmpCode) {
            return this.serviceEmp.getOneKeyString({ EmpCode: dbData.EmpCode });
          } else {
            return of(undefined);
          }
        }))
        .subscribe((dbData: Employee) => {
          if (dbData) {
          this.InfoValue.NameThai = dbData.NameThai;
          }
        }, error => console.error(error), () => {
          if (this.isCopying) {
            this.InfoValue.EmpCode = "";
            this.InfoValue.Creator = undefined;
            this.InfoValue.CreateDate = undefined;
            this.InfoValue.Modifyer = undefined;
            this.InfoValue.ModifyDate = undefined;
          }
          this.buildForm();
        });
    }
    else {
      this.InfoValue = {
        EmpCode: ""
      };
      this.buildForm();
    }
  }

  // Option
  optionLevelMethod(): void {
    if (!this.optionLevel) {
      this.optionLevel = [
        { label: "Level 1", value: 1 },
        { label: "Level 2", value: 2 },
        { label: "Level 3", value: 3 },
      ];
    }
  }

  // Build Form
  buildForm(): void {

    this.regConfig = [
      // BasemodelRequireWorkpermit //
      {
        type: typeField.inputclick,
        label: "EmpCode",
        inputType: inputType.text,
        name: "EmpCode",
        readonly: this.denySave,
        value: this.InfoValue.EmpCode,
        validations: [
          {
            name: ValidatorField.required,
            validator: Validators.required,
            message: "This field is required"
          },
        ]
      },
      {
        type: typeField.inputclick,
        label: "NameThai",
        inputType: inputType.text,
        name: "NameThai",
        readonly: this.denySave,
        value: this.InfoValue.NameThai,
        validations: [
          {
            name: ValidatorField.required,
            validator: Validators.required,
            message: "This field is required"
          },
        ]
      },
      {
        type: typeField.select,
        label: "SubLevel",
        name: "SubLevel",
        readonly: this.denySave,
        options: this.optionLevel,
        value: this.InfoValue.SubLevel,
        validations: [
          {
            name: ValidatorField.required,
            validator: Validators.required,
            message: "This field is required"
          },
        ]
      },
    ];
    // let ExcludeList = this.regConfig.map((item) => item.name);
  }

  // set communicate
  SetCommunicatetoParent(): void {
    if (this.isValid) {
      this.communicateService.toParent(this.InfoValue);
    }
  }

  // submit dynamic form
  submitDynamicForm(InfoValue?: ReturnValue<AllowedEmployee>): void {
    if (InfoValue) {
      if (!this.denySave) {
        let template: AllowedEmployee = InfoValue.value
        // Template
        for (let key in template) {
          // console.log(key);
          this.InfoValue[key] = template[key];
        }
        this.isValid = InfoValue.valid;
        //debug here
        // console.log(JSON.stringify(InfoValue));
        this.SetCommunicatetoParent();
      }
    }
  }

  // event from component
  FromComponents(): void {
    this.subscription2 = this.serviceShared.ToParent$.subscribe(data => {
      if (data.name.indexOf("EmpCode") !== -1 || data.name.indexOf("NameThai") !== -1) {
        this.serviceDialogs.dialogSelectEmployee(this.viewCon)
          .subscribe((emp: Employee) => {
            if (emp) {
              let temp = ["EmpCode", "NameThai"]
              temp.forEach(item => {
                this.serviceShared.toChild(
                  {
                    name: item,
                    value: emp[item]
                  });
              });

              this.InfoValue.EmpCode = emp.EmpCode;
              this.InfoValue.NameThai = emp.NameThai;
            }
          });
      }
    });
  }
}
