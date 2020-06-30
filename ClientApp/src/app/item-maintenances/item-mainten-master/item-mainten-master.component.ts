import { Component, ViewContainerRef, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
// components
import { BaseMasterComponent } from '../../shared/base-master-component';
// models
import { ItemMaintenance, StatusMaintenance } from '../shared/item-maintenance.model';
// services
import { ItemMaintenService, ItemMaintenCommunicateService } from '../shared/item-mainten.service';
import { AuthService } from '../../core/auth/auth.service';
import { DialogsService } from '../../dialogs/shared/dialogs.service';
// timezone
import * as moment from 'moment-timezone';
import { ItemMaintenTableComponent } from '../item-mainten-table/item-mainten-table.component';
import { User } from 'src/app/users/shared/user.model';

@Component({
  selector: 'app-item-mainten-master',
  templateUrl: './item-mainten-master.component.html',
  styleUrls: ['./item-mainten-master.component.scss']
})
export class ItemMaintenMasterComponent
extends BaseMasterComponent<ItemMaintenance, ItemMaintenService>
implements OnInit {
  constructor(
    service: ItemMaintenService,
    serviceCom: ItemMaintenCommunicateService,
    authService: AuthService,
    dialogsService: DialogsService,
    viewContainerRef: ViewContainerRef,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super(
      service,
      serviceCom,
      authService,
      dialogsService,
      viewContainerRef
    );

    this.authService.currentUser.subscribe(x => this.currentUser = x);
  }

  // Parameter
  backToSchedule = false;
  noReport = false;
  loadReportPaint = false;
  currentUser?: User;

  @ViewChild(ItemMaintenTableComponent)
  private tableComponent: ItemMaintenTableComponent;
  // override
  ngOnInit(): void {
    // override class
    super.ngOnInit();

    this.route.paramMap.subscribe((param: ParamMap) => {
      const key: number = Number(param.get('condition') || 0);
      const itemMaintenanceId: number = Number(param.get('itemmaintenanceid') || 0);
      if (key) {
        // can go back to last page
        this.backToSchedule = true;

        const itemMainten: ItemMaintenance = {
          ItemMaintenanceId: 0,
          PlanStartDate: new Date,
          PlanEndDate: new Date,
          RequireMaintenanceId: key
        };
        setTimeout(() => {
          this.onDetailEdit(itemMainten);
        }, 500);
      } else if (itemMaintenanceId) {
        // can go back to last page
        this.backToSchedule = true;
        this.noReport = true;

        setTimeout(() => {
          this.onDetailEdit({ItemMaintenanceId: itemMaintenanceId});
        } , 500);

        // this.service.getOneKeyNumber({
        //  ItemMaintenanceId: itemMaintenanceId,
        // }).subscribe(dbData => {
        //    setTimeout(() => {
        //      this.onDetailEdit(dbData);
        //    }, 500);
        //  });
      }
    }, error => console.error(error));
  }

  // on change time zone befor update to webapi
  changeTimezone(value: ItemMaintenance): ItemMaintenance {
    const zone = 'Asia/Bangkok';
    if (value !== null) {
      if (value.CreateDate !== null) {
        value.CreateDate = moment.tz(value.CreateDate, zone).toDate();
      }
      if (value.ModifyDate !== null) {
        value.ModifyDate = moment.tz(value.ModifyDate, zone).toDate();
      }
    }
    return value;
  }

  // onReload
  onReloadData(): void {
    this.tableComponent.reloadData();
  }

  // on detail edit override
  onDetailEdit(editValue?: ItemMaintenance): void {
    if (editValue) {
      if (editValue.StatusMaintenance === StatusMaintenance.Complate) {
        if (!this.currentUser || !this.currentUser.SubLevel || this.currentUser.SubLevel !== 3) {
          this.dialogsService.error('Access Deny', 'การซ่อมบำรุง ดำเนินการแล้วเสร็จไม่สามารถแก้ไขได้ !!!', this.viewContainerRef);
          return;
        }
      }
    }

    super.onDetailEdit(editValue);
  }

  // on show report
  onReport(Value?: ItemMaintenance): void {
    if (Value) {
      this.loadReportPaint = !this.loadReportPaint;
    }
  }

  // on back from report
  onBack(): void {
    this.loadReportPaint = !this.loadReportPaint;
    if (this.backToSchedule) {
      this.location.back();
    }
  }

  // on save complete
  onSaveComplete(): void {
    this.dialogsService.context('System message', 'Save completed.', this.viewContainerRef)
      .subscribe(result => {
        this.canSave = false;
        this.ShowEdit = false;
        if (this.backToSchedule) {
          if (this.noReport) {
            this.location.back();
          } else {
            this.onReport(this.editValue);
          }
        } else {
          this.editValue = undefined;
          this.onDetailView(undefined);
          this.onReloadData();
        }
      });
  }
}
