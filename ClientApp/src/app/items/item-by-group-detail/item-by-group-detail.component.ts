// angular
import { Component, ViewContainerRef, ViewChild, Input } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
// models
import { Item } from "../shared/item.model";
import { ItemByGroup } from "../shared/item-by-group.model";
import { EmployeeGroupMis } from "../../employees/shared/employee-group-mis.model";
// components
import { BaseEditComponent } from "../../shared/base-edit-component";
// 3rd party
import { SelectItem, Tree } from "primeng/primeng";
// services
import { AuthService } from "../../core/auth/auth.service";
import { DialogsService } from "../../dialogs/shared/dialogs.service";
import { ItemTypeService } from "../../item-types/shared/item-type.service";
import { ShareService } from "../../shared/share.service";
import { BranchService } from "../../branchs/shared/branch.service";
import { ItemService, ItemByGroupCommunicateService } from "../shared/item.service";
import { EmployeeGroupMisService } from "../../employees/shared/employee-group-mis.service";

@Component({
  selector: 'app-item-by-group-detail',
  templateUrl: './item-by-group-detail.component.html',
  styleUrls: ['./item-by-group-detail.component.scss']
})
export class ItemByGroupDetailComponent extends BaseEditComponent<ItemByGroup, ItemService> {
  constructor(
    service: ItemService,
    serviceCom: ItemByGroupCommunicateService,
    private serviceGroupOfWork: EmployeeGroupMisService,
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
  @Input() ReadOnly: boolean = true;
  groupOfWorks: Array<EmployeeGroupMis>;

  // on get data by key
  onGetDataByKey(value?: ItemByGroup): void {
    if (value) {
      this.editValue = value;
      this.buildForm();
    } else {
      this.editValue = { Items: new Array, ItemCount: 0 };
      this.buildForm();
    }
  }

  // build form
  buildForm(): void {
    this.getGroupOfWork();

    this.editValueForm = this.fb.group({
      GroupMis: [this.editValue.GroupMis],
      GroupMisString: [this.editValue.GroupMisString,
        [
          Validators.required,
        ]
      ],
      ItemCount: [this.editValue.ItemCount],
      Items: [this.editValue.Items],
      //BaseModel
      Creator: [this.editValue.Creator],
      CreateDate: [this.editValue.CreateDate],
      Modifyer: [this.editValue.Modifyer],
      ModifyDate: [this.editValue.ModifyDate],
    });
    this.editValueForm.valueChanges.subscribe((data: any) => this.onValueChanged(data));
  }

  // get item type
  getGroupOfWork(): void {
    if (!this.groupOfWorks) {
      this.groupOfWorks = new Array;
    }
    this.serviceGroupOfWork.getAll()
      .subscribe(dbGroupOfWorks => {
        this.groupOfWorks = [...dbGroupOfWorks];
      });
  }

  // open dialog
  openDialog(type?: string): void {
    if (this.ReadOnly) {
      return;
    }

    if (type) {
      if (type === "GroupOfWork") {
        this.serviceDialogs.dialogSelectGroupMis(this.viewContainerRef)
          .subscribe(groupOrWork => {
            if (groupOrWork) {
              this.editValueForm.patchValue({
                GroupMis: groupOrWork.GroupMIS,
                GroupMisString: `${groupOrWork.GroupDesc}`,
              });
            }
          });
      } else if (type === "Item") {
        this.serviceDialogs.dialogSelectItems(this.viewContainerRef)
          .subscribe(items => {
            if (items) {
              items.forEach((item, index) => {
                if (!this.editValue.Items.find(itemCode => itemCode.ItemId === item.ItemId)) {
                  let copy:Item = { ...item };
                  this.editValue.Items.push(copy);
                }
              });
              this.editValue.Items = this.editValue.Items.slice();
              // Update to form
              this.editValueForm.patchValue({
                Items: this.editValue.Items
              });
              this.onValueChanged();
            }
          });
      }
    }
  }

  // ItemEmployee remove
  onItemRemove(anyData?: { data: Item, mode: number }): void {
    //console.log("Data is", JSON.stringify(anyData));
    if (anyData) {
      if (anyData.mode === 0) {
        // Found Index
        let indexItem: number = this.editValue.Items.indexOf(anyData.data);
        // Remove at Index
        this.editValue.Items.splice(indexItem, 1);
        // Angular need change data for update view
        this.editValue.Items = this.editValue.Items.slice();
        // Update to form
        this.editValueForm.patchValue({
          Items: this.editValue.Items
        });
      }
    }
  }
}
