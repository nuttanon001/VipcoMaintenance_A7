// angular
import { Component, ViewContainerRef, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
// models
import { Item,ItemStatus } from "../shared/item.model";
import { Workgroup } from "../../work-groups/shared/workgroup.model";
import { Branch } from "../../branchs/shared/branch.model";
import { ItemType } from "../../item-types/shared/item-type.model";
// components
import { BaseEditComponent } from "../../shared/base-edit-component";
// 3rd party
import { SelectItem } from "primeng/primeng";
// services
import { AuthService } from "../../core/auth/auth.service";
import { DialogsService } from "../../dialogs/shared/dialogs.service";
import { ItemTypeService } from "../../item-types/shared/item-type.service";
import { ShareService } from "../../shared/share.service";
import { BranchService } from "../../branchs/shared/branch.service";
import { ItemService, ItemCommunicateService } from "../shared/item.service";

@Component({
  selector: 'app-item-edit',
  templateUrl: './item-edit.component.html',
  styleUrls: ["../../shared/styles/edit2.style.scss"],
})
export class ItemEditComponent extends BaseEditComponent<Item, ItemService> {
  constructor(
    service: ItemService,
    serviceCom: ItemCommunicateService,
    private serviceItemType: ItemTypeService,
    private serviceBranch: BranchService,
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
  @ViewChild("ImageFile") ImageFile;
  workGroup: Workgroup;
  branchs: Array<Branch>;
  itemTypes: Array<ItemType>;
  itemStatus: Array<{ Label: string, Value: number }>
  // on get data by key
  onGetDataByKey(value?: Item): void {
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
        ItemId: 0,
        ItemStatus: 1,
      };
      this.buildForm();
    }
    
  }

  // build form
  buildForm(): void {
    this.getBranch();
    this.getItemStatus();
    this.getItemType();

    this.editValueForm = this.fb.group({
      ItemId: [this.editValue.ItemId],
      ItemCode: [this.editValue.ItemCode,
      [
        Validators.required,
        Validators.maxLength(50)
      ]
      ],
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
      Model: [this.editValue.Model,
      [
        Validators.maxLength(200),
      ]
      ],
      Brand: [this.editValue.Brand,
        [
          Validators.maxLength(200),
        ]
      ],
      RegisterDate: [this.editValue.RegisterDate,],
      CancelDate: [this.editValue.CancelDate],
      Property: [this.editValue.Property,
      [
        Validators.maxLength(200),
      ]
      ],
      Property2: [this.editValue.Property2,
      [
        Validators.maxLength(200),
      ]
      ],
      Property3: [this.editValue.Property3,
      [
        Validators.maxLength(200),
      ]
      ],
      GroupMis: [this.editValue.GroupMis],
      ItemStatus: [this.editValue.ItemStatus],
      ItemImage: [this.editValue.ItemImage],
      Creator: [this.editValue.Creator],
      CreateDate: [this.editValue.CreateDate],
      Modifyer: [this.editValue.Modifyer],
      ModifyDate: [this.editValue.ModifyDate],
      //FK
      ItemTypeId: [this.editValue.ItemTypeId,
        [
          Validators.required
        ]
      ],
      EmpResponsible: [this.editValue.EmpResponsible],
      BranchId: [this.editValue.BranchId],
      //ViewModel
      ItemTypeString: [this.editValue.ItemTypeString],
      EmpResposibleString: [this.editValue.EmpResposibleString],
      GroupMisString: [this.editValue.GroupMisString],
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
          this.itemTypes = dbItemType.filter((item: ItemType) =>
            item.WorkGroupId === this.workGroup.WorkGroupId).slice();
        });
    }
  }
  // get branch
  getBranch(): void {
    if (!this.branchs) {
      this.branchs = new Array;
    }

    this.serviceBranch.getAll()
      .subscribe(dbBranch => {
        if (dbBranch) {
          this.branchs = dbBranch.sort((item1, item2) => {
            if (item1.Name > item2.Name) {
              return 1;
            }
            if (item1.Name < item2.Name) {
              return -1;
            }
            return 0;
          }).slice();
        }
      });
  }
  // get item status
  getItemStatus(): void {
    if (!this.itemStatus) {
      this.itemStatus = new Array;
    }

    this.itemStatus.push({ Label: "Use", Value: 1 });
    this.itemStatus.push({ Label: "Repair", Value: 2 });
    this.itemStatus.push({ Label: "Cancel", Value: 3 });
  }
  // open dialog
  openDialog(type?: string): void {
    if (type) {
      if (type === "Employee") {
        this.serviceDialogs.dialogSelectEmployee(this.viewContainerRef)
          .subscribe(emp => {
            if (emp) {
              this.editValueForm.patchValue({
                EmpResponsible: emp.EmpCode,
                EmpResposibleString: `คุณ${emp.NameThai}`,
              });
            }
          });
      } else if (type === "GroupOfWork") {
        this.serviceDialogs.dialogSelectGroupMis(this.viewContainerRef)
          .subscribe(groupOrWork => {
            // debug here
            console.log(groupOrWork);

            if (groupOrWork) {
              this.editValueForm.patchValue({
                GroupMis: groupOrWork.GroupMIS,
                GroupMisString: `${groupOrWork.GroupDesc}`,
              });
            }
          });
      }
    }
  }
  // File Image
  onFileUploadChange($event): void {
    let file = $event.dataTransfer ? $event.dataTransfer.files[0] : $event.target.files[0];
    let pattern = /image/;
    if (!file.type.match(pattern)) {
      this.ImageFile.nativeElement.value = "";
      this.serviceDialogs.error("ไม่เข้าเงื่อนไข", "ระบบบันทึกเฉพาะไฟล์รูปภาพเท่านั้น !!!", this.viewContainerRef)
      return;
    } else {
      this.readImageFileToString64($event.target);
    }
  }
  // Read image
  readImageFileToString64(inputValue: any): void {
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.editValueForm.patchValue({ ItemImage: myReader.result });
    }
    myReader.readAsDataURL(file);
  }
  // open ObsoleteItem
  openObsoleteItem(): void {
    if (this.editValue) {
      if (this.editValue.ItemStatus === ItemStatus.Cancel) {
        this.serviceDialogs.dialogInfoObsoleteItem(this.viewContainerRef,
          {
            info:
            {
              ObsoleteItemId: 0,
              ItemId: this.editValue.ItemId
            },
            multi: false,
            option: false
          }).subscribe();
      }
    }
  }
}
