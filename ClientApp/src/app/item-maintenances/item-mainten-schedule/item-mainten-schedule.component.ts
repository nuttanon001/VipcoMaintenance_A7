import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
// rxjs
import { Observable, Subscription, interval } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, take } from 'rxjs/operators';

// model
import { OptionItemMaintenSchedule } from '../shared/option-item-mainten-schedule.model';
import { ItemMaintenance } from '../shared/item-maintenance.model';
// 3rd patry
import { LazyLoadEvent } from 'primeng/primeng';
// service
import { AuthService } from '../../core/auth/auth.service';
import { DialogsService } from '../../dialogs/shared/dialogs.service';
import { ItemMaintenService, ItemMaintenCommunicateService } from '../shared/item-mainten.service';
import { RequireMaintenService } from '../../require-maintenances/shared/require-mainten.service';
import { MyPrimengColumn, ColumnType } from 'src/app/shared/column.model';

@Component({
  selector: 'app-item-mainten-schedule',
  templateUrl: './item-mainten-schedule.component.html',
  styleUrls: ['./item-mainten-schedule.component.scss']
})
export class ItemMaintenScheduleComponent implements OnInit, OnDestroy {
  /** paint-task-schedule ctor */
  constructor(
    private service: ItemMaintenService,
    private serviceRequire: RequireMaintenService,
    private serviceCom: ItemMaintenCommunicateService,
    private serviceDialogs: DialogsService,
    private serviceAuth: AuthService,
    private viewContainerRef: ViewContainerRef,
    private fb: FormBuilder,
    private router: Router,
    public route: ActivatedRoute) {
    this.scrollHeight = (window.innerHeight - this.sizeForm) + 'px';
  }

  // Parameter
  // form
  reportForm: FormGroup;
  // model
  columnUppers: Array<MyPrimengColumn>;
  columnLowers: Array<MyPrimengColumn>;
  columns: Array<MyPrimengColumn>;
  datasource: Array<any>;
  totalRecords = 0;
  first = 0;
  pageRow = 15;
  needReset = false;
  loading: boolean;
  scrollHeight: string;
  sizeForm = 250;
  // subscription
  subscription: Subscription;
  subscription1: Subscription;
  // time
  message = 0;
  count = 0;
  time = 1800;
  // mode
  mode: number | undefined;
  schedule: OptionItemMaintenSchedule;
  ItemMaintenanceId: number | undefined;
  ItemMaintenanceEdit: ItemMaintenance | undefined;
  canSave = false;
  // report
  isLinkMail = false;
  loadReport: boolean;
  ReportType?: string;
  onLoading = false;
  // angular hook
  ngOnInit(): void {
    this.loadReport = false;
    this.ReportType = '';

    this.datasource = new Array;
    this.route.paramMap.subscribe((param: ParamMap) => {
      const key: number = Number(param.get('condition') || 0);

      if (key) {
        this.mode = key;

        const schedule: OptionItemMaintenSchedule = {
          Mode: this.mode
        };

        if (this.serviceAuth.getAuth) {
          if (this.mode === 1) {
            schedule.Creator = this.serviceAuth.getAuth.EmpCode;
            schedule.CreatorName = this.serviceAuth.getAuth.NameThai;
          }
        }

        this.buildForm(schedule);
      }
    }, error => console.error(error));

    this.subscription1 = this.serviceCom.ToParent$.subscribe(
      (TypeValue: [ItemMaintenance, boolean]) => {
        this.ItemMaintenanceEdit = TypeValue[0];
        this.canSave = TypeValue[1];
      });
  }

  // destroy
  ngOnDestroy(): void {
    if (this.subscription) {
      // prevent memory leak when component destroyed
      this.subscription.unsubscribe();
    }

    if (this.subscription1) {
      this.subscription1.unsubscribe();
    }
  }

  // build form
  buildForm(schedule?: OptionItemMaintenSchedule): void {
    if (!schedule) {
      schedule = {
        Mode: this.mode || 2,
      };
    }
    this.schedule = schedule;

    this.reportForm = this.fb.group({
      Filter: [this.schedule.Filter],
      ProjectMasterId: [this.schedule.ProjectMasterId],
      ProjectMasterString: [this.schedule.ProjectMasterString],
      Mode: [this.schedule.Mode],
      Skip: [this.schedule.Skip],
      Take: [this.schedule.Take],
      ItemMaintenanceId: [this.schedule.ItemMaintenanceId],
      RequireMaintenanceId: [this.schedule.RequireMaintenanceId],
      GroupMaintenanceId: [this.schedule.GroupMaintenanceId],
      Creator: [this.schedule.Creator],
      SDate: [this.schedule.SDate],
      EDate: [this.schedule.EDate],
      // template
      CreatorName: [this.schedule.CreatorName],
    });

    this.reportForm.valueChanges
      .debounceTime(500)
      .subscribe((data: any) => this.onValueChanged(data));

    const ControlFilter: AbstractControl | undefined = this.reportForm.get('Filter');
    if (ControlFilter) {
      ControlFilter.valueChanges
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

    this.schedule = this.reportForm.value;
    this.onGetTaskMasterSchedule(this.schedule);
  }

  // get task master schedule data
  onGetTaskMasterSchedule(schedule: OptionItemMaintenSchedule): void {
    if (this.ItemMaintenanceId) {
      schedule.ItemMaintenanceId = this.ItemMaintenanceId;
    }
    this.onLoading = true;
    this.datasource = new Array;
    if (this.mode) {
      if (this.mode > 1) {
          this.service.getItemMaintenanceSchedule(schedule)
              .subscribe(dbDataSchedule => {
            this.onSetupDataTable(dbDataSchedule);
          }, error => {
            this.totalRecords = 0;
            this.columns = new Array;
            this.datasource = new Array;
            this.reloadData();
            }, () => this.loading = false);
        return;
      }
    }

    this.serviceRequire.getRequireMaintenanceWithItemMaintenanceSchedule(schedule)
      .subscribe(dbDataSchedule => {
        this.onSetupDataTable(dbDataSchedule);
      }, error => {
        this.columns = new Array;
        this.datasource = new Array;
        this.reloadData();
      }, () => this.loading = false);

  }

  // on setup datatable
  onSetupDataTable(dbDataSchedule: any): void {
    if (!dbDataSchedule || !dbDataSchedule.DataTable) {
      this.columns = new Array;
      this.datasource = new Array;
      this.reloadData();
      this.onLoading = false;
      return;
    }

    // Debug here Data Schedule
    // console.log("JsonData", JSON.stringify(dbDataSchedule));

    this.totalRecords = dbDataSchedule.TotalRow;

    this.columns = new Array;
    this.columnUppers = new Array;

    // column Row1
    this.columnUppers = [
      { header: 'JobNo', rowspan: 2, width: 200 },
      { header: 'GroupMTN', rowspan: 2, width: 150 },
      { header: 'Item', rowspan: 2, width: 200 },
      { header: 'Progress', rowspan: 2, width: 100 }
    ];

    for (const month of dbDataSchedule.ColumnsTop) {
      this.columnUppers.push({
        header: month.Name,
        colspan: month.Value,
        width: (month.Value * 35),
        type: ColumnType.Option2
      });
    }
    // column Row2
    this.columnLowers = new Array;

    for (const name of dbDataSchedule.ColumnsLow) {
      this.columnLowers.push({
        header: name,
        // style: { "width": "25px" }
      });
    }

    // column Main
    this.columns = [
      { header: 'JobNo', field: 'ProjectMaster', width: 200 },
      { header: 'GroupMTN', field: 'GroupMaintenance', width: 150 },
      { header: 'Item', field: 'Item', width: 200 },
      { header: 'Progress', field: 'Progress', width: 100 }
    ];

    let i = 0;
    for (const name of dbDataSchedule.ColumnsAll) {
      if (name.indexOf('Col') >= -1) {
        this.columns.push({
          header: this.columnLowers[i].header, field: name, width: 35, type: ColumnType.Option1,
        });
        i++;
      }
    }

    if (this.needReset) {
      this.first = 0;
      this.needReset = false;
    }

    this.datasource = dbDataSchedule.DataTable.slice();
    this.onLoading = false;
    this.reloadData();
  }

  // reload data
  reloadData(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    const result = interval(this.time)
      .pipe(
        take(this.time),
        map((x) => {
          this.message = this.time - x;
          this.count = (x / this.time) * 100;
          if (x === (this.time - 1)) {
            if (this.reportForm.value) {
              this.onGetTaskMasterSchedule(this.reportForm.value);
            }
          }
        })
      );
    this.subscription = result.subscribe();
  }

  // reset
  resetFilter(): void {
    this.datasource = new Array;
    this.buildForm();

    this.reportForm.patchValue({
      Skip: 0,
      Take: 10,
    });

    // this.onGetTaskMasterSchedule(this.reportForm.value);
  }

  // load Data Lazy
  loadDataLazy(event: LazyLoadEvent): void {
    // in a real application, make a remote request to load data using state metadata from event
    // event.first = First row offset
    // event.rows = Number of rows per page
    // event.sortField = Field name to sort with
    // event.sortOrder = Sort order as number, 1 for asc and -1 for dec
    // filters: FilterMetadata object having field as key and filter value, filter matchMode as value

    // imitate db connection over a network

    this.pageRow = (event.rows || 15);
    // imitate db connection over a network
    this.reportForm.patchValue({
      Skip: event.first,
      Take: (event.rows || 15),
    });
  }

  // on select dialog
  onShowDialog(type?: string): void {
    if (type) {
      if (type === 'Employee') {
        this.serviceDialogs.dialogSelectEmployee(this.viewContainerRef)
          .subscribe(emp => {
            // console.log(emp);
            if (emp) {
              this.needReset = true;
              this.reportForm.patchValue({
                Creator: emp.EmpCode,
                CreatorName: `คุณ${emp.NameThai}`,
              });
            }
          });
      } else if (type === 'Project') {
        this.serviceDialogs.dialogSelectProject(this.viewContainerRef)
          .subscribe(project => {
            if (project) {
              this.needReset = true;
              this.reportForm.patchValue({
                ProjectMasterId: project.ProjectCodeMasterId,
                ProjectMasterString: `${project.ProjectCode}/${project.ProjectName}`,
              });
            }
          });
      }
    }
  }

  // on update progress
  onSelectItemMaintenanceId(ItemMaintenanceId?: number): void {
    if (!this.serviceAuth.currentUserValue) {
      this.serviceDialogs.error('Warning Message', 'Please login befor show information.', this.viewContainerRef)
        .subscribe(result => { });
      return;
    }

    if (ItemMaintenanceId && this.mode) {
      if (this.mode > 1) {
        if (ItemMaintenanceId) {
          this.service.getOneKeyNumber({
            ItemMaintenanceId: ItemMaintenanceId || 0,
            PlanStartDate: new Date,
            PlanEndDate: new Date
          }).subscribe(dbData => {
            this.ItemMaintenanceEdit = dbData;
            setTimeout(() => this.serviceCom.toChildEdit(dbData), 1000);
          });
        }
      } else {
        // On Schedule readonly show dialog
        this.serviceDialogs.dialogSelectItemMaintenance(ItemMaintenanceId, this.viewContainerRef);
      }
    } else {
      this.serviceDialogs.error('Warning Message', 'This maintenance not plan yet.', this.viewContainerRef);
    }
  }

  // on cancel edit
  onCancelEdit(): void {
    this.ItemMaintenanceEdit = undefined;
    this.canSave = false;
  }

  // on update data
  onUpdateToDataBase(): void {
    if (this.ItemMaintenanceEdit) {
      const tempValue: ItemMaintenance = Object.assign({}, this.ItemMaintenanceEdit);

      if (this.serviceAuth.getAuth) {
        tempValue.Modifyer = this.serviceAuth.getAuth.UserName || '';
      }
      // update data
      this.service.updateModelWithKey(tempValue).subscribe(
        (complete: any) => {
          console.log('complete', JSON.stringify(complete));
          this.serviceDialogs
            .context('System message', 'Save completed.', this.viewContainerRef)
            .subscribe(result => {
              this.onCancelEdit();
              this.onGetTaskMasterSchedule(this.reportForm.value);
            });
        },
        (error: any) => {
          this.canSave = true;
          this.serviceDialogs.error('Failed !',
            'Save failed with the following error: Invalid Identifier code !!!', this.viewContainerRef);
        }
      );
    }
  }

  // on show report
  onShowReportPaint(ItemMaintenanceId?: number, type?: string): void {
    if (ItemMaintenanceId && type) {
      this.ItemMaintenanceId = ItemMaintenanceId;
      this.loadReport = !this.loadReport;
      this.ReportType = type;
    }
  }

  // on back from report
  onBack(): void {
    this.loadReport = !this.loadReport;
    this.ReportType = '';
    setTimeout(() => {
      if (this.ItemMaintenanceEdit) {
        this.serviceCom.toChildEdit(this.ItemMaintenanceEdit);
      }
    }, 500);
  }
}
