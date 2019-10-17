// Angular Core
import { FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewContainerRef, Output, EventEmitter, Input } from '@angular/core';
// Components
import { BaseScheduleComponent } from 'src/app/shared2/baseclases/base-schedule.component';
// Models
import { User } from 'src/app/users/shared/user.model';
import { Scroll } from 'src/app/shared2/basemode/scroll.model';
import { Format } from 'src/app/shared2/basemode/my-colmun.model';
import { ScrollData } from 'src/app/shared2/basemode/scroll-data.model';
import { ObsoleteItem, StatusObsolete } from '../shared/obsolete-item.model';
import { OptionField } from 'src/app/shared2/dynamic-form/field-config.model';
// Services
import { AuthService } from 'src/app/core/auth/auth.service';
import { ObsoleteItemService } from '../shared/obsolete-item.service';
import { DialogsService } from 'src/app/dialogs/shared/dialogs.service';
// Rxjs
import { of, empty } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-obsolete-item-schedule',
  templateUrl: './obsolete-item-schedule.component.html',
  styleUrls: ['./obsolete-item-schedule.component.scss']
})
export class ObsoleteItemScheduleComponent
  extends BaseScheduleComponent<ObsoleteItem, ObsoleteItemService> {
  constructor(service: ObsoleteItemService,
    fb: FormBuilder,
    viewRef: ViewContainerRef,
    serviceDialog: DialogsService,
    private serviceAuth: AuthService,
  ) {
    super(service, fb, viewRef, serviceDialog);
    serviceAuth.currentUser.subscribe(dbUser => {
      this.user = dbUser;
    });
  }
  // Parameters
  user?: User;
  option?: Array<OptionField>;
  @Input() OptionFilter: Scroll;
  @Output() returnSelectedWith: EventEmitter<{ data: ObsoleteItem, option: number }> = new EventEmitter<{ data: ObsoleteItem, option: number }>();
  @Output() filter: EventEmitter<Scroll> = new EventEmitter<Scroll>();

  ngOnInit(): void {
    if (this.OptionFilter) {
      this.scroll = this.OptionFilter;
    }

    /*
     * Wait = 1,
     * ApproveLevel1,
     * ApproveLevel2,
     * ApproveLevel3,
     * FixOnly,
     * Cancel
     */

    if (!this.option) {
      this.option = [
        { label: "Wait", value: 1 },
        { label: "ApproveLevel 2", value: 3 },
        { label: "ApproveLevel 3", value: 4 },
        { label: "Rejected", value: 5 },
        { label: "Cancel", value: 6 }
      ];
    }

    super.ngOnInit();
  }

  /**
   * Getdata from web api
   * @param schedule
   */
  onGetData(schedule: Scroll): void {
    // Emit scroll to MasterComponent
    this.filter.emit(schedule);

    this.service.getSchedule(schedule)
      .subscribe((dbData: ScrollData<any>) => {
        if (!dbData) {
          this.totalRecords = 0;
          this.columns = new Array;
          this.datasource = new Array;
          this.loading = false;
          return;
        } else if (!dbData.Data) {
          this.totalRecords = 0;
          this.columns = new Array;
          this.datasource = new Array;
          this.loading = false;
          return;
        }

        if (dbData.Scroll) {
          this.totalRecords = dbData.Scroll.TotalRow || 0;
        } else {
          this.totalRecords = 0;
        }

        // new Column Array
        this.columns = new Array;
        this.columns = [
          { header: "Date", field: "ObsoleteDate", width: 110, format: Format.Date },
          { header: "Infomation", field: "ObsoleteItems", width: 550 },
        ];

        if (dbData.Data) {
          this.datasource = dbData.Data.slice();
        } else {
          this.datasource = new Array;
        }

        if (this.needReset) {
          this.first = 0;
          this.needReset = false;
        }
      }, error => {
        this.totalRecords = 0;
        this.columns = new Array;
        this.datasource = new Array;
      }, () => this.loading = false);
  }

  onShowDialog(type?: string): void {
    throw new Error("Method not implemented.");
  }

  /**
   * Return item have click to master
   * @param subItem
   */
  onClickSubItem(subItem?: any,option?: number): void {
    if (subItem) {
      this.returnSelectedWith
        .emit({
          data: {
            ObsoleteItemId: subItem.ObsoleteItemId,
            ItemId: subItem.ItemId,
            ItemCode: subItem.ItemCode,
            ItemName: subItem.ItemName,
            Status: subItem.Status
          },
          option: option
        });
    }
  }

  result?: any;

  // On Change status
  onChangeStatus(raw?: ObsoleteItem, status?: number) {
    if (raw && status) {
      if (this.user) {
        let update: ObsoleteItem = { ObsoleteItemId : 0};

        for (let key in raw) { update[key] = raw[key]; }

        // Update user modifyer
        update.Modifyer = this.user.UserName || "";

        if (update.Status === StatusObsolete.Wait || update.Status === StatusObsolete.ApproveLevel1) {
          // Only sub level 2
          if (this.user.SubLevel !== 2) {
            this.serviceDialogs.error("Access Deny", "Access is restricted", this.viewCon).subscribe();
            return;
          }
        } else if (update.Status === StatusObsolete.ApproveLevel2) {
          // Only sub level 3
          if (this.user.SubLevel !== 3) {
            this.serviceDialogs.error("Access Deny", "Access is restricted", this.viewCon).subscribe();
            return;
          }
        } else if (update.Status === StatusObsolete.ApproveLevel3 || update.Status === StatusObsolete.Cancel) {
          this.serviceDialogs.error("Access Deny", "Access is restricted", this.viewCon).subscribe();
          return;
        }

        // Update status
        if (status === 1) {
          if (update.Status === StatusObsolete.Wait || update.Status === StatusObsolete.ApproveLevel1) {
            update.Status = StatusObsolete.ApproveLevel2;
          } else if (update.Status === StatusObsolete.ApproveLevel2) {
            update.Status = StatusObsolete.ApproveLevel3;
          }
          // Send to info
          this.onClickSubItem(update,2);

        } else if (status === 2) {
          //
          this.serviceDialogs.confirm("System Messsage", "Do you want to delete this item.", this.viewCon)
            .pipe(switchMap((result1: boolean) => {
              if (result1) {
                if (update.Status === StatusObsolete.Wait || update.Status === StatusObsolete.ApproveLevel1) {
                  update.Status = StatusObsolete.Cancel;
                } else if (update.Status === StatusObsolete.ApproveLevel2) {
                  update.Status = StatusObsolete.FixOnly;
                  update.ApproveToFix = true;
                  update.ApproveToObsolete = false;
                }
                return this.service.updateStatus(update);
              } else {
                return empty;
              }
            }), map((data) => {
              if (data) {
                return this.serviceDialogs.context("System Message", "Update Complated.", this.viewCon);
              } else {
                return this.serviceDialogs.error("System Message", "Update Failed.", this.viewCon);
              }
            })).subscribe(() => this.resetFilter());
        }
      }
    }
  }

  // On Print file
  onPrint(raw?: ObsoleteItem): void {
    // Only ApproveLevel3
    if (raw.Status !== StatusObsolete.ApproveLevel3 || this.user.SubLevel !== 3) {
      this.serviceDialogs.error("Access Deny", "Access is restricted", this.viewCon).subscribe();
      return;
    }
    this.service.getPaperReport(raw.ObsoleteItemId).subscribe(data => {
      // console.log(data);
      this.loading = false;
    }, () => this.loading = false, () => this.loading = false);
  }

  canClick(raw?: ObsoleteItem): boolean {
    if (raw) {
      if (this.user) {
        if (raw.Status === StatusObsolete.Wait || raw.Status === StatusObsolete.ApproveLevel1) {
          // Only sub level 2
          if (this.user.SubLevel !== 2) {
            return true;
          } else {
            return false;
          }
        } else if (raw.Status === StatusObsolete.ApproveLevel2) {
          // Only sub level 3
          if (this.user.SubLevel !== 3) {
            return true;
          } else {
            return false;
          }
        } else if (raw.Status === StatusObsolete.ApproveLevel3 || raw.Status === StatusObsolete.Cancel) {
          return true;
        }
      }
    }
    return true;
  }

  canPrint(raw?: ObsoleteItem): boolean {
    if (raw.Status !== StatusObsolete.ApproveLevel3 || this.user.SubLevel !== 3) {
      return true;
    } else {
      return false;
    }
  }

  canEdit(raw?: ObsoleteItem): boolean {
    if (raw) {
      if (this.user) {
        if (raw.Status === StatusObsolete.Wait || raw.Status === StatusObsolete.ApproveLevel1) {
          // Only sub level 2
          if (this.user.SubLevel !== 1) {
            return true;
          } else {
            return false;
          }
        } else if (raw.Status === StatusObsolete.ApproveLevel2) {
          // Only sub level 3
          if (this.user.SubLevel !== 2) {
            return true;
          } else {
            return false;
          }
        } else if (raw.Status === StatusObsolete.ApproveLevel3) {
          if (this.user.SubLevel !== 3) {
            return true;
          } else {
            return false;
          }
        } else if (raw.Status === StatusObsolete.Cancel) {
          return true;
        }
      }
    }
    return true;
  }
}
