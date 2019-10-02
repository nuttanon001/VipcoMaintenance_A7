// angular
import { Component, ViewContainerRef } from "@angular/core";
import { FormBuilder, FormControl, Validators, AbstractControl } from "@angular/forms";
// models
import { Branch } from "../../branchs/shared/branch.model";
import { RequireMaintenance,RequireStatus } from "../../require-maintenances/shared/require-maintenance.model";
import { Item } from "../../items/shared/item.model";
import { AttachFile } from "../../shared/attach-file.model";
// components
import { BaseEditComponent } from "../../shared/base-edit-component";
// 3rd party
import { SelectItem } from "primeng/primeng";
// services
import { AuthService } from "../../core/auth/auth.service";
import { DialogsService } from "../../dialogs/shared/dialogs.service";
import { ShareService } from "../../shared/share.service";
import {
  RequireMaintenService, RequireMaintenCommunicateService
} from "../shared/require-mainten.service";
import { BranchService } from "../../branchs/shared/branch.service";
import { EmployeeGroupMisService } from "../../employees/shared/employee-group-mis.service";

@Component({
  selector: 'app-require-mainten-edit',
  templateUrl: './require-mainten-edit.component.html',
  styleUrls: ['./require-mainten-edit.component.scss']
})
export class RequireMaintenEditComponent extends BaseEditComponent<RequireMaintenance, RequireMaintenService> {
  constructor(
    service: RequireMaintenService,
    serviceCom: RequireMaintenCommunicateService,
    private serviceBranch: BranchService,
    private serviceGroupMis: EmployeeGroupMisService,
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
  branchs: Array<Branch>;
  attachFiles: Array<AttachFile>;
  // on get data by key
  onGetDataByKey(value?: RequireMaintenance): void {
    if (value) {
      this.service.getOneKeyNumber(value)
        .subscribe(dbData => {
          this.editValue = dbData;
        }, error => console.error(error), () => this.buildForm());
    } else {
      this.editValue = {
        RequireMaintenanceId: 0,
        RequireDate: new Date,
        RequireDateTime: new Date().toLocaleTimeString("th-TH", { hour12: false }),
        RequireStatus: RequireStatus.Waiting,
      };

      if (this.serviceAuth.getAuth) {
        this.editValue.RequireEmp = this.serviceAuth.getAuth.EmpCode;
        this.editValue.RequireEmpString = this.serviceAuth.getAuth.NameThai;
        this.editValue.MailApply = this.serviceAuth.getAuth.MailAddress;
        // Get GroupMIS
        this.getEmployeeGroupMisByEmpCode(this.editValue.RequireEmp);
      }

      this.buildForm();
    }
  }

  // build form
  buildForm(): void {
    //GetData
    this.getBranchs();
    this.getAttach();

    this.editValueForm = this.fb.group({
      RequireMaintenanceId: [this.editValue.RequireMaintenanceId],
      RequireNo: [this.editValue.RequireNo],
      RequireDate: [this.editValue.RequireDate,
        [
          Validators.required,
        ]
      ],
      RequireDateTime: [this.editValue.RequireDateTime,
        [
          Validators.required,
        ]
      ],
      Description: [this.editValue.Description,
        [
          Validators.required,
          Validators.maxLength(250)
        ]
      ],
      Remark: [this.editValue.Remark,
        [
          Validators.maxLength(250)
        ]
      ],
      RequireStatus: [this.editValue.RequireStatus],
      GroupMIS: [this.editValue.GroupMIS],
      RequireEmp: [this.editValue.RequireEmp],
      ItemId: [this.editValue.ItemId],
      BranchId: [this.editValue.BranchId],
      ProjectCodeMasterId: [this.editValue.ProjectCodeMasterId],
      MaintenanceApply: [this.editValue.MaintenanceApply],
      MailApply: [this.editValue.MailApply],
      // BaseModel
      Creator: [this.editValue.Creator],
      CreateDate: [this.editValue.CreateDate],
      Modifyer: [this.editValue.Modifyer],
      ModifyDate: [this.editValue.ModifyDate],
      // ViewModel
      ItemCode: [this.editValue.ItemCode,
        [
          Validators.required
        ]
      ],
      RequireEmpString: [this.editValue.RequireEmpString],
      ProjectCodeMasterString: [this.editValue.ProjectCodeMasterString],
      GroupMISString: [this.editValue.GroupMISString],
      BranchString: [this.editValue.BranchString],
      AttachFile: [this.editValue.AttachFile],
      RemoveAttach: [this.editValue.RemoveAttach],
    });
    this.editValueForm.valueChanges.subscribe((data: any) => this.onValueChanged(data));
  }

  // get item type
  getBranchs(): void {
    if (!this.branchs) {
      this.branchs = new Array;
    }
    if (this.branchs) {
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

          if (!this.editValue.BranchId) {
            this.editValue.BranchId = this.branchs.find(item => item.Name.toLowerCase() === "vipco2").BranchId || undefined;
            this.editValueForm.patchValue({
              BranchId: this.editValue.BranchId
            });
          }
        })
    }
  }

  // get employee group mis
  getEmployeeGroupMisByEmpCode(EmpCode: string): void {
    if (EmpCode) {
      this.serviceGroupMis.getGroupMinsByEmpCode(EmpCode)
        .subscribe(GroupMis => {
          if (GroupMis) {
            this.editValue.GroupMIS = GroupMis.GroupMIS;
            this.editValue.GroupMISString = GroupMis.GroupDesc;
            // Patch data to form
            this.editValueForm.patchValue({
              GroupMIS: this.editValue.GroupMIS,
              GroupMISString: this.editValue.GroupMISString,
            });
          }
        })
    }
  }

  // open dialog
  openDialog(type?: string): void {
    if (type) {
      if (type === "Employee") {
        this.serviceDialogs.dialogSelectEmployee(this.viewContainerRef)
          .subscribe(emp => {
            if (emp) {
              this.editValueForm.patchValue({
                RequireEmp: emp.EmpCode,
                RequireEmpString: `คุณ${emp.NameThai}`,
              });

              this.getEmployeeGroupMisByEmpCode(emp.EmpCode);
            }
          });
      } else if (type === "Project") {
        this.serviceDialogs.dialogSelectProject(this.viewContainerRef)
          .subscribe(project => {
            if (project) {
              this.editValueForm.patchValue({
                ProjectCodeMasterId: project.ProjectCodeMasterId,
                ProjectCodeMasterString: `${project.ProjectCode}/${project.ProjectName}`,
              });
            }
          });
      } else if (type === "Item") {
        this.serviceDialogs.dialogSelectItem(this.viewContainerRef)
          .subscribe(item => {
            if (item) {
              this.editValueForm.patchValue({
                ItemId: item.ItemId,
                ItemCode: `${item.ItemCode}/${item.Name}`,
              });
            }
          });
      } else if (type === "GroupMis") {
        this.serviceDialogs.dialogSelectGroupMis(this.viewContainerRef)
          .subscribe(groupMis => {
            if (groupMis) {
              this.editValueForm.patchValue({
                GroupMIS: groupMis.GroupMIS,
                GroupMISString: `${groupMis.GroupDesc}`,
              });
            }
          });
      }
    }
  }

  ////////////
  // Module //
  ////////////

  // get attact file
  getAttach(): void {
    if (this.editValue && this.editValue.RequireMaintenanceId > 0) {
      this.service.getAttachFile(this.editValue.RequireMaintenanceId)
        .subscribe(dbAttach => {
          this.attachFiles = dbAttach.slice();
        }, error => console.error(error));
    }
  }

  // on Attach Update List
  onUpdateAttachResults(results: FileList): void {
    // debug here
    // console.log("File: ", results);
    this.editValue.AttachFile = results;
    // debug here
    // console.log("Att File: ", this.RequirePaintList.AttachFile);

    this.editValueForm.patchValue({
      AttachFile: this.editValue.AttachFile
    });
  }

  // on Attach delete file
  onDeleteAttachFile(attach: AttachFile): void {
    if (attach) {
      if (!this.editValue.RemoveAttach) {
        this.editValue.RemoveAttach = new Array;
      }
      // remove
      this.editValue.RemoveAttach.push(attach.AttachFileId);
      // debug here
      // console.log("Remove :",this.editValue.RemoveAttach);

      this.editValueForm.patchValue({
        RemoveAttach: this.editValue.RemoveAttach
      });
      let template: Array<AttachFile> =
        this.attachFiles.filter((e: AttachFile) => e.AttachFileId !== attach.AttachFileId);

      this.attachFiles = new Array();
      setTimeout(() => this.attachFiles = template.slice(), 50);
    }
  }

  // open file attach
  onOpenNewLink(link: string): void {
    if (link) {
      window.open(link, "_blank");
    }
  }
}
