// Angular Core
import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
// Components
import { BaseMasterComponent } from 'src/app/shared2/baseclases/base-master-component';
// Services
import { AuthService } from 'src/app/core/auth/auth.service';
import { ObsoleteItemService } from '../shared/obsolete-item.service';
import { DialogsService } from 'src/app/dialogs/shared/dialogs.service';
import { ObsoleteItemCommunicateService } from '../shared/obsolete-item-communicate.service';
// Models
import { ObsoleteItem, StatusObsolete } from '../shared/obsolete-item.model';
// Rxjs
import { empty } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ObsoleteItemScheduleComponent } from '../obsolete-item-schedule/obsolete-item-schedule.component';
import { User } from 'src/app/users/shared/user.model';

@Component({
  selector: 'app-obsolete-item-master',
  templateUrl: './obsolete-item-master.component.html',
  styleUrls: ['./obsolete-item-master.component.scss']
})
export class ObsoleteItemMasterComponent
  extends BaseMasterComponent<ObsoleteItem, ObsoleteItemService, ObsoleteItemCommunicateService> {

  constructor(
    service: ObsoleteItemService,
    serviceCom: ObsoleteItemCommunicateService,
    serviceAuth: AuthService,
    serviceDialog: DialogsService,
    viewCon: ViewContainerRef,
  ) {
    super(service, serviceCom, serviceAuth, serviceDialog, viewCon);
    serviceAuth.currentUser.subscribe(dbUser => {
      this.user = dbUser;
    });
  }

  // Parameters
  user?: User;
  backToSchedule: boolean = false;
  showReport?: boolean = false;
  @ViewChild(ObsoleteItemScheduleComponent)
  private scheduleComponent: ObsoleteItemScheduleComponent;

  onReloadData(): void {
    this.scheduleComponent.onGetData(this.filter);
  }

  //////////////
  // OverRider
  //////////////
  // on detail view
  onDetailView(value?: { data: ObsoleteItem, option: number }): void {
    if (value) {

      // debug here
      console.log(JSON.stringify(value),JSON.stringify(this.user));

      if (value.option === 0) {
        this.dialogsService.dialogInfoObsoleteItem(this.viewContainerRef, {
          info: value.data,
          multi: false,
          option: false
        }).subscribe();
      } else if (value.option === 1) {
        if (value.data.Status === StatusObsolete.Wait || value.data.Status === StatusObsolete.ApproveLevel1) {
          // Only sub level 1
          if (this.user.SubLevel !== 1) {
            this.dialogsService.error("Access Deny", "Access is restricted", this.viewContainerRef).subscribe();
            return;
          }
        }

        this.displayValue = value.data;
        this.onLoading = true;
        this.ShowDetail = true;
        setTimeout(() => {
          this.communicateService.toChildEdit(this.displayValue);
          this.onLoading = false;
        }, 1000);
      } else if (value.option === 2) {
        this.displayValue = value.data;
        // Check status can edit if not readonly

        if (value.data.Status === StatusObsolete.Wait || value.data.Status === StatusObsolete.ApproveLevel1) {
          // Only sub level 2
          if (this.user.SubLevel !== 2) {
            this.dialogsService.error("Access Deny", "Access is restricted", this.viewContainerRef).subscribe();
            return;
          }
        } else if (value.data.Status === StatusObsolete.ApproveLevel2) {
          // Only sub level 2
          if (this.user.SubLevel !== 2) {
            this.dialogsService.error("Access Deny", "Access is restricted", this.viewContainerRef).subscribe();
            return;
          }
        } else if (value.data.Status === StatusObsolete.ApproveLevel3 || value.data.Status === StatusObsolete.FixOnly) {
          // Only sub level 3
          if (this.user.SubLevel !== 3) {
            this.dialogsService.error("Access Deny", "Access is restricted", this.viewContainerRef).subscribe();
            return;
          }
        }


        this.onLoading = true;
        this.ShowDetail = true;
        setTimeout(() => {
          this.communicateService.toChildEdit(this.displayValue);
          this.onLoading = false;
        }, 1000);
      }
    } else {
      if (this.user.SubLevel !== 1) {
        this.dialogsService.error("Access Deny", "Access is restricted", this.viewContainerRef).subscribe();
        return;
      }

      this.displayValue = undefined;
      this.ShowDetail = true;
      // this.communicateService.toChildEdit(this.displayValue);
      setTimeout(() => this.communicateService.toChildEdit(this.displayValue), 1000);
    }
  }

  // on insert data
  onInsertToDataBase(value: ObsoleteItem): void {
    if (this.authService.currentUserValue) {
      value["Creator"] = this.authService.currentUserValue.UserName || "";
    }

    let attachs = value.AttachFiles ? value.AttachFiles.slice() : undefined;
    // insert data
    this.service.addModel(value)
      .pipe(switchMap((complete: ObsoleteItem) => {
        if (complete.ObsoleteItemId) {
          this.displayValue = complete;
          if (attachs) {
            return this.service.postAttactFile(complete[this.service.keyName], attachs, complete.Creator || "");
          }
        }
        return empty();
      })).subscribe(() => {
        console.log("subscribe", this.onLoading);
      },
        (error: any) => {
          console.error(error);
          this.onLoading = false;
          this.dialogsService.error("Failed !",
            "Save failed with the following error: Data not been save", this.viewContainerRef);
        }, () => {
          if (this.onLoading) {
            this.onSaveComplete();
            this.onLoading = false;
          }
        });
  }

  // on update data
  onUpdateToDataBase(value: ObsoleteItem): void {
    if (this.authService.currentUserValue) {
      value["Modifyer"] = this.authService.currentUserValue.UserName || "";
    }

    let attachs = value.AttachFiles ? value.AttachFiles.slice() : undefined;
    let removes = value.RemoveAttach ? value.RemoveAttach.slice() : [];

    // update data
    this.service.updateModelWithKey(value)
      .pipe(switchMap((complete: ObsoleteItem) => {
        if (complete.ObsoleteItemId) {
          this.displayValue = complete;
          if (attachs) {
            return this.service.postAttactFile(complete[this.service.keyName], attachs, complete.Creator || "");
          }
        }
        return empty();
      }), switchMap((result: any) => {
        if (removes && removes.length > 0) {
          // Join number to string
          var AttachFileString = removes.join(",");
          return this.service.deleteAttactFile(AttachFileString);
        } else {
          return empty();
        }
      })).subscribe(() => {
        console.log("subscribe", this.onLoading);
      },
        (error: any) => {
          console.error(error);
          this.onLoading = false;
          this.dialogsService.error("Failed !",
            "Save failed with the following error: Data not been save", this.viewContainerRef);
        }, () => {
          if (this.onLoading) {
            this.onSaveComplete();
            this.onLoading = false;
          }
        });
  }
}
