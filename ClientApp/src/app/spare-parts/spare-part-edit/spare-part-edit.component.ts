// angular
import { Component, ViewContainerRef, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
// models
import { SparePart } from "../shared/spare-part.model";
import { RequireMaintenance } from "../../require-maintenances/shared/require-maintenance.model";
import { TypeMaintenance } from "../../type-maintenances/shared/type-maintenance.model";
import { Workgroup } from "../../work-groups/shared/workgroup.model";
// components
import { BaseEditComponent } from "../../shared/base-edit-component";
// services
import { AuthService } from "../../core/auth/auth.service";
import { ShareService } from "../../shared/share.service";
import { DialogsService } from "../../dialogs/shared/dialogs.service";
import { SparePartService, SparePartCommunicateService } from "../shared/spare-part.service";

@Component({
  selector: "app-spare-part-edit",
  templateUrl: "./spare-part-edit.component.html",
  styleUrls: ["./spare-part-edit.component.scss"]
})
export class SparePartEditComponent extends BaseEditComponent<SparePart, SparePartService> {
  constructor(
    service: SparePartService,
    serviceCom: SparePartCommunicateService,
    private serviceShared: ShareService,
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
  @ViewChild("ImageFile") ImageFile;
  // on get data by key
  onGetDataByKey(value?: SparePart): void {
    // WorkGroup
    this.serviceShared.getWorkGroup().subscribe(workgroup => {
      if (workgroup) {
        this.workGroup = {
          WorkGroupId: workgroup.WorkGroupId
        };
      }
    });

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
        SparePartId: 0,
      };
      this.buildForm();
    }
  }

  // build form
  buildForm(): void {
    // New form
    this.editValueForm = this.fb.group({
      SparePartId: [this.editValue.SparePartId],
      Code: [this.editValue.Code,
        [
          Validators.required,
        ]
      ],
      Name: [this.editValue.Name,
        [
          Validators.required,
          Validators.maxLength(200),
        ]
      ],
      Description: [this.editValue.Description,
        [
          Validators.maxLength(250),
        ]
      ],
      Remark: [this.editValue.Remark,
        [
          Validators.maxLength(200),
        ]
      ],
      Model: [this.editValue.Model,
        [
          Validators.maxLength(200),
        ]
      ],
      Size: [this.editValue.Size,
        [
          Validators.maxLength(200),
        ]
      ],
      Property: [this.editValue.Property,
        [
          Validators.maxLength(200),
        ]
      ],
      SparePartImage: [this.editValue.SparePartImage],
      UnitPrice: [this.editValue.UnitPrice],
      MinStock: [this.editValue.MinStock],
      MaxStock: [this.editValue.MaxStock],
      WorkGroupId: [this.editValue.WorkGroupId],
      // BaseModel
      Creator: [this.editValue.Creator],
      CreateDate: [this.editValue.CreateDate],
      Modifyer: [this.editValue.Modifyer],
      ModifyDate: [this.editValue.ModifyDate],
    });
    this.editValueForm.valueChanges.subscribe((data: any) => this.onValueChanged(data));
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
      this.editValueForm.patchValue({ SparePartImage: myReader.result });
    }
    myReader.readAsDataURL(file);
  }
}
