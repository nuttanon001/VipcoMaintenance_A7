import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { BaseScheduleComponent } from '../../shared/base-schedule.component';
import { ItemMaintenExport } from '../shared/item-mainten-export.model';
import { ItemMaintenService } from '../shared/item-mainten.service';
import { FormBuilder } from '@angular/forms';
import { DialogsService } from '../../dialogs/shared/dialogs.service';
import { AuthService } from '../../core/auth/auth.service';
import { ItemTypeService } from '../../item-types/shared/item-type.service';
import { Scroll } from '../../shared/scroll.model';
import { ScrollData } from '../../shared/scroll-data.model';
import { ColumnType } from '../../shared/column.model';
import { ItemType } from '../../item-types/shared/item-type.model';

@Component({
  selector: 'app-item-mainten-history',
  templateUrl: './item-mainten-history.component.html',
  styleUrls: ['./item-mainten-history.component.scss']
})
export class ItemMaintenHistoryComponent extends BaseScheduleComponent<ItemMaintenExport, ItemMaintenService> {

  constructor(
    service: ItemMaintenService,
    serviceItemType: ItemTypeService,
    fb: FormBuilder,
    viewCon: ViewContainerRef,
    serviceDialogs: DialogsService,
    private serviceAuth: AuthService,
  ) {
    super(service, fb, viewCon, serviceDialogs);
    const toDay = new Date;
    this.scroll = {
      EDate: new Date(toDay.getFullYear(), toDay.getMonth() + 1, 0),
      SDate: new Date(toDay.getFullYear(), toDay.getMonth() - 1, 1),
    };

    serviceItemType.getAll()
      .subscribe(dbItemType => {
        this.itemTypes = dbItemType ? dbItemType.slice() : new Array;
      });

    this.scrollHeight = (window.innerHeight - this.sizeForm) + "px"; 
  }

  itemTypes: Array<ItemType>;
  scrollHeight: string;
  sizeForm: number = 230;

  // get request data
  onGetData(schedule: Scroll): void {
    this.service.getExportData(schedule)
      .subscribe((dbData: ScrollData<ItemMaintenExport>) => {
        if (!dbData && !dbData.Data) {
          this.totalRecords = 0;
          this.columns = new Array;
          this.datasource = new Array;
          this.reloadData();
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
          { field: 'ItemCode', header: 'ItemCode', width: 100, type: ColumnType.Show },
          { field: 'ItemType', header: 'ItemType', width: 100, type: ColumnType.Show },
          { field: 'ItemName', header: 'ItemName', width: 250, type: ColumnType.Show },
          { field: 'RequestDateString2', header: 'RequestDate', width: 125, type: ColumnType.Show },
          { field: 'ApplyRequireDateString', header: 'ApplyDate', width: 125, type: ColumnType.Show },
          { field: 'FinishDateString2', header: 'FinishDate', width: 125, type: ColumnType.Show },
          { field: 'Description', header: 'Description', width: 250, type: ColumnType.Show },
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

        this.reloadData();
      }, error => {
        this.totalRecords = 0;
        this.columns = new Array;
        this.datasource = new Array;
        this.reloadData();
      }, () => this.loading = false);
  }

  // reset
  resetFilter(): void {
    this.datasource = new Array;
    const toDay = new Date;
    this.scroll = {
      EDate: new Date(toDay.getFullYear(), toDay.getMonth() + 1, 0),
      SDate: new Date(toDay.getFullYear(), toDay.getMonth() - 1, 1),
    };
    // this.loading = true;
    this.buildForm();
    this.onGetData(this.scroll);
  }

  // Open Dialog
  onShowDialog(type?: string): void {
    if (type.indexOf("Employee") !== -1) {
      this.serviceDialogs.dialogSelectEmployee(this.viewCon)
        .subscribe(employee => {
          this.reportForm.patchValue({
            Where: employee.EmpCode,
            Where2: employee.NameThai,
          });
        });
    }
  }

  onGetExportToFile(): void {
    if (this.reportForm) {
      this.loading = true;
      const scorll = this.reportForm.getRawValue() as Scroll;
      this.service.getExportXlsx(scorll).subscribe(data => {
        // console.log(data);
        this.loading = false;
      }, () => { },() => this.loading = false);
    }
  }
}
