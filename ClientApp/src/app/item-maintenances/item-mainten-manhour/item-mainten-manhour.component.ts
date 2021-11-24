import { Component, HostListener, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/auth/auth.service';
import { DialogsService } from 'src/app/dialogs/shared/dialogs.service';
import { debounceFunc } from 'src/app/items/item-master-list/item-master-list.component';
import { BaseScheduleComponent } from 'src/app/shared/base-schedule.component';
import { ColumnType, Format } from 'src/app/shared/column.model';
import { ScrollData } from 'src/app/shared/scroll-data.model';
import { Scroll } from 'src/app/shared/scroll.model';
import { OptionField } from 'src/app/shared2/dynamic-form/field-config.model';
import { ItemMaintenExport } from '../shared/item-mainten-export.model';
import { ItemMaintenService } from '../shared/item-mainten.service';

@Component({
  selector: 'app-item-mainten-manhour',
  templateUrl: './item-mainten-manhour.component.html',
  styleUrls: ['./item-mainten-manhour.component.scss']
})
export class ItemMaintenManhourComponent
extends BaseScheduleComponent<ItemMaintenExport, ItemMaintenService>
implements OnInit {

  constructor(
    service: ItemMaintenService,
    fb: FormBuilder,
    view: ViewContainerRef,
    private dialog: DialogsService,
    private auth: AuthService,
  ) {
    super(service, fb, view, dialog);
    this.scrollHeight = (window.innerHeight - this.sizeForm) + 'px';
  }

  optionEmp: OptionField[];
  scrollHeight: string;
  sizeForm = 230;

  ngOnInit() {
    this.service.getEmpMaintenance().pipe(
      catchError(() => of([])),
      map((dbEmpName: { EmpCode: string, EmpName: string }[]) => {
        this.optionEmp = dbEmpName && dbEmpName.length > 0 ? dbEmpName
                        .map((x) => ({ label: `${x.EmpName}`, value: x.EmpCode } as OptionField))
                        .filter((thing, index, self) => index === self.findIndex((t) => t.value === thing.value))
                        .sort((a, b) => a.label > b.label ? 1 : a.label < b.label ? -1 : 0)
                        .slice() : [];
        this.optionEmp.splice(0, 0, { label: 'None', value: undefined });
      })
    ).subscribe(() => this.buildForm());

    const toDay = new Date;
    this.scroll = {
      EDate: new Date(toDay.getFullYear(), toDay.getMonth() + 1, 0),
      SDate: new Date(toDay.getFullYear(), toDay.getMonth() - 1, 1),
    };
  }

  // build form
  buildForm(): void {
    if (!this.scroll) {
      this.scroll = {};
    }

    this.reportForm = this.fb.group({
      Filter: [this.scroll.Filter],
      SortField: [this.scroll.SortField],
      SortOrder: [this.scroll.SortOrder],
      TotalRow: [this.scroll.TotalRow],
      SDate: [this.scroll.SDate],
      EDate: [this.scroll.EDate],
      Where: [this.scroll.Where],
      Skip: [this.scroll.Skip],
      Take: [this.scroll.Take],
    });

    this.reportForm.valueChanges.pipe(debounceTime(250), distinctUntilChanged())
      .subscribe((data: any) => this.onValueChanged(data));
  }

  // get request data
  onGetData(schedule: Scroll): void {
    this.service.getExportData(schedule, 'ReportManhour/')
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
          { field: 'EmployeeName', header: 'EmployeeName', width: 100, type: ColumnType.Show },
          { field: 'ItemName', header: 'ItemName', width: 100, type: ColumnType.Show },
          { field: 'ItemCode', header: 'ItemCode', width: 250, type: ColumnType.Show },
          { field: 'ItemType', header: 'ItemType', width: 125, type: ColumnType.Show },
          { field: 'SDate', header: 'StartDate', width: 125, type: ColumnType.Show, format: Format.Date },
          { field: 'EDate', header: 'FinishDate', width: 125, type: ColumnType.Show, format: Format.Date },
          { field: 'StdHourStr', header: 'StdTime', width: 125, type: ColumnType.Show },
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
  onShowDialog(type?: string): void {}

  onGetExportToFile(): void {
    if (this.reportForm) {
      this.loading = true;
      const scorll = this.reportForm.getRawValue() as Scroll;
      this.service.getExportXlsx(scorll, 'ReportManhour/').subscribe(data => {
        // console.log(data);
        this.loading = false;
      }, () => { }, () => this.loading = false);
    }
  }

  @HostListener('window:resize', ['$event'])
  @debounceFunc()
  onResize(event: { target: { innerHeight: number; }; }) {
    // console.log("innerWidth", event.target.innerWidth);
    // console.log("innerHeight", event.target.innerHeight);

    this.scrollHeight = event.target.innerHeight - this.sizeForm + 'px';
  }
}
