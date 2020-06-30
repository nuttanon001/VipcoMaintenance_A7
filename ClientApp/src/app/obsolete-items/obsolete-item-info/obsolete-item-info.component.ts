// Angular Core
import { Validators } from '@angular/forms';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
// Components
import { BaseInfoComponent } from 'src/app/shared2/baseclases/base-info-component';
// Models
import { Item } from 'src/app/items/shared/item.model';
import { User } from 'src/app/users/shared/user.model';
import { AttachFile } from '../shared/attach-file.model';
import { Employee } from 'src/app/employees/shared/employee.model';
import { ObsoleteItem, StatusObsolete } from '../shared/obsolete-item.model';
import { typeField, ValidatorField, inputType, ReturnValue ,Validator } from 'src/app/shared2/dynamic-form/field-config.model';
// Services
import { AuthService } from 'src/app/core/auth/auth.service';
import { ShareService } from 'src/app/shared2/share.service';
import { ItemService } from 'src/app/items/shared/item.service';
import { ObsoleteItemService } from '../shared/obsolete-item.service';
import { DialogsService } from 'src/app/dialogs/shared/dialogs.service';
import { ObsoleteItemCommunicateService } from '../shared/obsolete-item-communicate.service';
// Rxjs
import { of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
// Moment
import * as moment from "moment";

@Component({
  selector: 'app-obsolete-item-info',
  templateUrl: './obsolete-item-info.component.html',
  styleUrls: ['./obsolete-item-info.component.scss']
})
export class ObsoleteItemInfoComponent
  extends BaseInfoComponent<ObsoleteItem, ObsoleteItemService, ObsoleteItemCommunicateService> {
  constructor(
    service: ObsoleteItemService,
    serviceCom: ObsoleteItemCommunicateService,
    private serviceAuth: AuthService,
    private serviceItem: ItemService,
    private serviceShared: ShareService,
    private serviceDialogs: DialogsService,
    private viewCon: ViewContainerRef,
  ) {
    super(service, serviceCom);
    serviceAuth.currentUser.subscribe(dbUser => {
      this.user = dbUser;
    });
  }

  // Parameter
  user?: User;
  attachFiles: Array<AttachFile>;
  Item?: Item;
  Lifetime?: string;
  ItemImage?: string | ArrayBuffer | null;
  requestValidator?: Validator = {
    name: ValidatorField.required,
    validator: Validators.required,
    message: "This field is required"
  };

  // Methods
  onGetDataByKey(InfoValue: ObsoleteItem): void {
    if (InfoValue && InfoValue.ObsoleteItemId) {
      // if set copy
      this.isCopying = InfoValue.Copying;
      this.service.getOneKeyNumber(InfoValue)
        .pipe(switchMap((dbData: ObsoleteItem) => {
          if (dbData) {
            this.isValid = true;
          }
          this.InfoValue = dbData;
          this.InfoValue.Status = InfoValue.Status;

          if (!this.InfoValue.ReadOnly) {
            if (this.InfoValue.Status === StatusObsolete.ApproveLevel2) {
              if (!this.InfoValue.Approve2NameThai) {
                this.InfoValue.Approve2 = this.user.EmpCode;
                this.InfoValue.Approve2NameThai = this.user.NameThai;
                this.InfoValue.Approve2Date = moment().toDate();
              }
            } else if (this.InfoValue.Status === StatusObsolete.ApproveLevel3) {
              if (!this.InfoValue.ComplateByNameThai) {
                this.InfoValue.ComplateBy = this.user.EmpCode;
                this.InfoValue.ComplateByNameThai = this.user.NameThai;
                this.InfoValue.ApproveToObsolete = true;
                this.InfoValue.ApproveToFix = false;
              }
            }
          }
          // new Array
          this.InfoValue.RemoveAttach = new Array;
          this.attachFiles = new Array;
          // Get attach file
          return this.service.getAttachFile(this.InfoValue.ObsoleteItemId);
        }), switchMap((dbAttachs: Array<AttachFile>) => {
          if (dbAttachs) {
            dbAttachs.forEach(item => {
              let temp: AttachFile = {
                AttachFileId: 0
              };
              // loop deep clone without $id don't need it
              for (let key in item) {
                if (key.indexOf("$id") === -1) {
                  temp[key] = item[key];
                }
              }

              // Set copying id is 0 , create and modify is undefined.
              if (this.isCopying) {
                temp.Creator = undefined;
                temp.CreateDate = undefined;
                temp.Modifyer = undefined;
                temp.ModifyDate = undefined;
              }
              // push line to array
              this.attachFiles.push(temp);
            });
            // try to new array of data for refresh attach component
            this.attachFiles = this.attachFiles.slice();
            if (this.attachFiles[0]) {
              this.ItemImage = this.attachFiles[0].FileAddress;
            }
          }

          if (this.InfoValue.ItemId) {
            return this.serviceItem.getOneKeyNumber({ ItemId: this.InfoValue.ItemId});
          } else {
            return of(undefined);
          }
        }), map((dbItem: Item) => {
          if (dbItem) {
            this.Item = dbItem;
            this.Lifetime = this.CalcLifetime
               (dbItem.CancelDate ? moment(dbItem.CancelDate) : moment(),
                dbItem.RegisterDate ? moment(dbItem.RegisterDate) : moment());
          }
        })).subscribe(() => this.buildForm());
    }
    else {
      // Debug Here
      // console.log("ObsoleteItem");

      this.InfoValue = {
        ObsoleteItemId: 0,
        ObsoleteDate: moment().toDate(),
        Status: StatusObsolete.Wait,
        Approve1: this.user.EmpCode,
        Approve1NameThai: this.user.NameThai,
        Approve1Date: moment().toDate(),
      };

      this.Item = { 
        ItemId: 0,
        //Name: "",
        //ItemCode: "",
      };

      this.buildForm();
    }
  }

  // Build Form
  buildForm(): void {
    this.regConfig = [
      {
        type: typeField.date,
        label: "Obsolete Date",
        name: "ObsoleteDate",
        readonly: this.denySave || this.InfoValue.Status !== StatusObsolete.Wait,
        value: this.InfoValue.ObsoleteDate,
        validations: [
          {
            name: ValidatorField.required,
            validator: Validators.required,
            message: "This field is required"
          },
        ]
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
        readonly: this.denySave || this.InfoValue.Status !== StatusObsolete.Wait,
        value: this.Item.Name,
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
        label: "Tool/Machine No.",
        inputType: inputType.text,
        name: "ItemCode",
        readonly: this.denySave || this.InfoValue.Status !== StatusObsolete.Wait,
        value: this.Item.ItemCode,
        validations: [
          {
            name: ValidatorField.required,
            validator: Validators.required,
            message: "This field is required"
          },
        ]
      },

      {
        type: typeField.date,
        label: "Register Date",
        name: "RegisterDate",
        readonly: true,
        value: this.Item.RegisterDate,
      },

      {
        type: typeField.input,
        label: "S/N",
        inputType: inputType.text,
        name: "Property",
        readonly: true,
        value: this.Item.Property,
      },

      {
        type: typeField.input,
        label: "Lifetime",
        inputType: inputType.text,
        name: "Lifetime",
        readonly: true,
        value: this.Lifetime,
      },

      {
        type: typeField.input,
        label: "FixedAsset",
        inputType: inputType.number,
        name: "FixedAsset",
        readonly: this.denySave || this.InfoValue.Status !== StatusObsolete.Wait,
        value: this.InfoValue.FixedAsset,
        validations: [
          {
            name: ValidatorField.required,
            validator: Validators.required,
            message: "This field is required"
          },
        ]
      },

      {
        type: typeField.input,
        label: "WorkGroup",
        inputType: inputType.text,
        name: "GroupMisString",
        readonly: true,
        value: this.Item.GroupMisString,
      },

      {
        type: typeField.textarea,
        label: "Obsolete Description",
        name: "Description",
        readonly: this.denySave || this.InfoValue.Status !== StatusObsolete.Wait,
        // hidden: this.InfoValue.Status === StatusObsolete.Wait,
        value: this.InfoValue.Description,
        validations: [
          {
            name: ValidatorField.required,
            validator: Validators.required,
            message: "This field is required"
          },
          {
            name: ValidatorField.maxLength,
            validator: Validators.maxLength(500),
            message: "This field is maximum 500 characters"
          },
        ]
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
        readonly: this.denySave || this.InfoValue.Status !== StatusObsolete.ApproveLevel2,
        hidden: this.InfoValue.Status === StatusObsolete.Wait,
        value: this.InfoValue.RequestNameThai,
        validations: [
          //{
          //  name: ValidatorField.required,
          //  validator: Validators.required,
          //  message: "This field is required"
          //},
          this.InfoValue.Status === StatusObsolete.ApproveLevel2 ? this.requestValidator : undefined,
        ]
      },

      {
        type: typeField.input,
        label: "Reviewed By Level 2",
        inputType: inputType.text,
        name: "Approve2NameThai",
        readonly: true,
        hidden: this.InfoValue.Status === StatusObsolete.Wait,
        value: this.InfoValue.Approve2NameThai,
      },
      
      //-----------------------------------------------------------------//

      {
        type: typeField.textarea,
        label: "Remark",
        name: "Remark",
        readonly: this.denySave || this.InfoValue.Status !== StatusObsolete.ApproveLevel3,
        hidden: this.InfoValue.Status !== StatusObsolete.ApproveLevel3,
        value: this.InfoValue.Remark,
        validations: [
          this.InfoValue.Status === StatusObsolete.ApproveLevel3 ? this.requestValidator : undefined,
          //{
          //  name: ValidatorField.required,
          //  validator: Validators.required,
          //  message: "This field is required"
          //},
          {
            name: ValidatorField.maxLength,
            validator: Validators.maxLength(500),
            message: "This field is maximum 500 characters"
          },
        ]
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
        hidden: this.InfoValue !== StatusObsolete.ApproveLevel3,
        value: this.InfoValue.ComplateByNameThai,
      },
    ];
    // let ExcludeList = this.regConfig.map((item) => item.name);
  }

  // Set communicate
  SetCommunicatetoParent(): void {
    if (this.isValid && this.ItemImage) {
      this.communicateService.toParent(this.InfoValue);
      return;
    }
    this.communicateService.toParent(undefined);
  }

  // Calc Lifetime
  CalcLifetime = (sDate?: moment.Moment, eDate?: moment.Moment) => {
    let months = sDate.diff(eDate, 'month', true);
    return months >= 12 ? `${(months / 12).toFixed(1)} ปี` : `${months.toFixed(0)} เดือน`;
  }

  // Submit dynamic form
  submitDynamicForm(InfoValue?: ReturnValue<ObsoleteItem>): void {
    if (InfoValue) {
      if (!this.denySave) {
        let template: ObsoleteItem = InfoValue.value;
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

  // Event from component
  FromComponents(): void {
    this.subscription2 = this.serviceShared.ToParent$.subscribe(data => {
      if (data.name.indexOf("RequestNameThai") !== -1) {
        this.serviceDialogs.dialogSelectEmployee(this.viewCon)
          .subscribe((emp: Employee) => {
            if (emp) {
              this.serviceShared.toChild(
                {
                  name: data.name,
                  value: `${emp.NameThai}`
                });

              this.InfoValue.Request = emp.EmpCode;
              this.InfoValue.RequestNameThai = emp.NameThai;
            }
          });
      } else if (data.name.indexOf("Name") !== -1 || data.name.indexOf("ItemCode") !== -1) {
        this.serviceDialogs.dialogSelectedItemMk2(this.viewCon,
          {
            info: {ItemId:0},
            multi: false,
            option: true
          })
          .subscribe((item: Item) => {
            if (item) {
              let temp: Array<string> = ["Name", "ItemCode", "RegisterDate", "Property","GroupMisString"]
              temp.forEach(tName => {
                this.serviceShared.toChild(
                  {
                    name: tName,
                    value: item[tName]
                  });
                this.Item[tName] = item[tName];
              });

              // Bind to InfoValue
              this.InfoValue.ItemId = item.ItemId;
              this.InfoValue.ItemCode = item.ItemCode;
              this.InfoValue.ItemName = item.Name;
              this.InfoValue.FixedAsset = item.Property2 ? parseFloat(item.Property2) : 0;
              // Debug here
              // console.log(this.Item.RegisterDate, this.InfoValue.ObsoleteDate);

              this.Lifetime = this.CalcLifetime(
                this.InfoValue.ObsoleteDate ? moment(this.InfoValue.ObsoleteDate) : moment(),
                this.Item.RegisterDate ? moment(this.Item.RegisterDate) : moment());

              // Debug here
              // console.log(this.Lifetime);

              this.serviceShared.toChild(
                {
                  name: "Lifetime",
                  value: this.Lifetime
                });
            }
          });
      }
    });
  }

  // On Attach Update List
  onUpdateAttach(event: any): void {
    if (event.target.files) {
      let pattern = /image/;
      if (event.target.files.length > 0) {

        // new Array if null
        if (!this.InfoValue.AttachFiles) {
          this.InfoValue.AttachFiles = new Array;
        }

        let removeFile: Array<string> = new Array;
        // loop get file from filelist object
        for (var i = 0; i <= event.target.files.length - 1; i++) {
          const selectedFile = event.target.files[i];
          if (selectedFile.size <= 2448576 && selectedFile.type.match(pattern)) {
            if (!this.InfoValue.AttachFiles.find(item => item.name === selectedFile.name)) {
              this.InfoValue.AttachFiles.push(selectedFile);
              this.readImageFileToString64(event.target);
            }
          } else {
            removeFile.push(selectedFile.name);
          }
        }

        const temp = Array.from(this.InfoValue.AttachFiles).map(item => {
          let data = <AttachFile>{
            FileName: item.name,
            Size: item.size,
            NotSave: true,
          };

          return data;
        });

        // new Array if attachFiles is null
        if (!this.attachFiles) {
          this.attachFiles = new Array;
        }
        // Add temp to attachFiles
        if (temp) {
          // Remove not save
          this.attachFiles =
            this.attachFiles.filter(item => !item.NotSave).slice();

          temp.forEach(item => {
            this.attachFiles.push(Object.assign({}, item));
          });

          this.attachFiles = this.attachFiles.slice();
        }

        if (removeFile && removeFile.length > 0) {
          let removeFile1: string = "";
          removeFile.forEach((file, index) => {
            removeFile1 += `${index + 1}. ${file} \n`;
          });

          this.serviceDialogs.error("File size must be under 2MB.", removeFile1, this.viewCon)
            .subscribe();
        }
      }
    }
  }

  // Read image
  readImageFileToString64(inputValue: any): void {
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.ItemImage = myReader.result;
      this.SetCommunicatetoParent();
    }
    myReader.readAsDataURL(file);
  }
}
