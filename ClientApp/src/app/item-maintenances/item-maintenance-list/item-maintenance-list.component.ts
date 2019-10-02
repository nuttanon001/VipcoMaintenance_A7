import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { ItemMaintenService } from '../shared/item-mainten.service';
import { WorkGroupMaintenService } from 'src/app/work-group-maintenances/shared/work-group-mainten.service';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { DialogsService } from 'src/app/dialogs/shared/dialogs.service';
import { ItemMaintenList } from '../shared/item-mainten-list.model';
import { MyPrimengColumn } from 'src/app/shared/column.model';
import { Scroll } from 'src/app/shared/scroll.model';
import { WorkGroupMaintenance } from 'src/app/work-group-maintenances/shared/work-group-maintenance';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { ScrollData } from 'src/app/shared/scroll-data.model';
import { LazyLoadEvent } from 'primeng/primeng';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-item-maintenance-list',
  templateUrl: './item-maintenance-list.component.html',
  styleUrls: ['./item-maintenance-list.component.scss']
})
export class ItemMaintenanceListComponent implements OnInit, OnDestroy {

  constructor(
    private service: ItemMaintenService,
    private serviceMainGroup: WorkGroupMaintenService,
    private fb: FormBuilder,
    private viewCon: ViewContainerRef,
    private serviceAuth: AuthService,
    private serviceDialogs: DialogsService,
  ) {
    // 100 for bar | 200 for titil and filter
    this.mobHeight = (window.screen.height - 300) + "px";
  }

  //Parameter
  datasource: Array<ItemMaintenList>;
  totalRecords: number;
  loading: boolean;
  columns: Array<MyPrimengColumn>;
  columnUppers: Array<MyPrimengColumn>;
  // ScrollData
  scroll: Scroll;
  reportForm: FormGroup;
  rowPage: number = 25;
  first: number = 0;
  needReset: boolean = false;
  mobHeight: any;
  // Data
  wgMaintenances: Array<WorkGroupMaintenance>;

  ngOnInit() {
    // Get ItemType
    if (!this.wgMaintenances) {
      this.wgMaintenances = new Array;
    }
    this.serviceMainGroup.getAll()
      .subscribe(dbWorkgroup => {
        if (dbWorkgroup) {
          this.wgMaintenances = dbWorkgroup.sort((item1, item2) => {
            if (item1.Name > item2.Name) {
              return 1;
            }
            if (item1.Name < item2.Name) {
              return -1;
            }
            return 0;
          }).slice();
        } else {
          this.wgMaintenances = new Array;
        }
     
      });

    this.buildForm();
  }

  // destroy
  ngOnDestroy(): void {
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
      WhereId: [this.scroll.WhereId],
      Where2Id: [this.scroll.Where2Id],
      Skip: [this.scroll.Skip],
      Take: [this.scroll.Take],
    });

    this.reportForm.valueChanges.pipe(debounceTime(250), distinctUntilChanged())
      .subscribe((data: any) => this.onValueChanged(data));

    const ControlMoreActivities: AbstractControl | undefined = this.reportForm.get("Filter");
    if (ControlMoreActivities) {
      ControlMoreActivities.valueChanges
        .pipe(
          debounceTime(150),
          distinctUntilChanged()).subscribe((data: any) => {
            this.needReset = true;
          });
    }

    const ControlItemType: AbstractControl | undefined = this.reportForm.get("WhereId");
    if (ControlItemType) {
      ControlItemType.valueChanges
        .pipe(
          debounceTime(150),
          distinctUntilChanged()).subscribe((data: any) => {
            this.needReset = true;
          });
    }
  }

  // on value change
  onValueChanged(data?: any): void {
    if (!this.reportForm) { return; }
    this.scroll = this.reportForm.value;
    this.loading = true;
    this.onGetData(this.scroll);
  }

  // get request data
  onGetData(schedule: Scroll): void {
    console.log("Scroll:",JSON.stringify(schedule));

    this.service.getListMaintenance(schedule)
      .subscribe((dbData: ScrollData<ItemMaintenList>) => {
        if (!dbData) {
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

        this.columns = new Array;
        this.columns = [
          { field: 'ItemCode', header: 'Code', width: 125, canSort:true },
          { field: 'ItemName', header: 'Name', width: 250, canSort: true },
          { field: 'RequireDateString', header: 'Date', width: 125, canSort: true },
          { field: 'RequireEmpName', header: 'By Emplyee', width: 150, },
          { field: 'MainGroupName', header: 'MTN Group', width: 150, },
          { field: 'MainTypeName', header: 'MTN Type', width: 150, },
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

  // load Data Lazy
  loadDataLazy(event: LazyLoadEvent): void {
    // in a real application, make a remote request to load data using state metadata from event
    // event.first = First row offset
    // event.rows = Number of rows per page
    // event.sortField = Field name to sort with
    // event.sortOrder = Sort order as number, 1 for asc and -1 for dec
    // filters: FilterMetadata object having field as key and filter value, filter matchMode as value
    this.rowPage = (event.rows || 25);
    // imitate db connection over a network
    this.reportForm.patchValue({
      Skip: event.first,
      Take: (event.rows || 25),
      SortField: event.sortField,
      SortOrder: event.sortOrder,
    });
  }

  // reset
  resetFilter(): void {
    this.datasource = new Array;
    this.scroll = undefined;
    this.loading = true;
    this.buildForm();
    this.onGetData(this.scroll);
  }

  // get report data
  onReport(): void {
    //if (this.reportForm) {
    //  let scorll = this.reportForm.getRawValue() as Scroll;
    //  this.loading = true;
    //  // Set take all record
    //  scorll.Skip = 0;
    //  scorll.Take = this.totalRecords;
    //  this.service.getXlsxScroll(scorll).subscribe(data => {
    //    //console.log(data);
    //    this.loading = false;
    //  });
    //}
  }

  onSelectItemMaintenanceId(ItemMaintenanceId?: number): void {
    if (!this.serviceAuth.currentUserValue) {
      this.serviceDialogs.error("Warning Message", "Please login befor show information.", this.viewCon)
        .subscribe(result => { });
      return;
    }

    if (ItemMaintenanceId) {
      this.serviceDialogs.dialogSelectItemMaintenance(ItemMaintenanceId, this.viewCon);
    } else {
      this.serviceDialogs.error("Warning Message", "This maintenance not plan yet.", this.viewCon);
    }
  }
}
