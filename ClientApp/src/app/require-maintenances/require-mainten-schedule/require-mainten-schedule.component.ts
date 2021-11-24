import { Component, OnInit, OnDestroy, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
// rxjs
import { Observable, Subscription, interval } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, take, switchMap } from 'rxjs/operators';
// model
import { OptionRequireMaintenance } from '../shared/option-require-maintenance.model';
import { RequireMaintenance, RequireMTVm } from '../shared/require-maintenance.model';
// 3rd patry
import { LazyLoadEvent } from 'primeng/primeng';
// service
import { DialogsService } from '../../dialogs/shared/dialogs.service';
import { AuthService } from '../../core/auth/auth.service';
import { RequireMaintenService } from '../shared/require-mainten.service';
import { MyPrimengColumn, ColumnType, Format } from 'src/app/shared/column.model';
import { OptionField } from 'src/app/shared2/dynamic-form/field-config.model';
import { Scroll } from 'src/app/shared2/basemode/scroll.model';

@Component({
  selector: 'app-require-mainten-schedule',
  templateUrl: './require-mainten-schedule.component.html',
  styleUrls: ['./require-mainten-schedule.component.scss']
})

export class RequireMaintenScheduleComponent implements OnInit, OnDestroy {

  constructor(
    private service: RequireMaintenService,
    private serviceDialogs: DialogsService,
    private serviceAuth: AuthService,
    private viewContainerRef: ViewContainerRef,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.scrollHeight = (window.innerHeight - this.sizeForm) + 'px';
  }

  // Parameter
  // model
  columns: Array<MyPrimengColumn>;
  totalRecords = 0;
  datasource: Array<any>;
  scrollHeight: string;
  subscription: Subscription;
  // time
  message = 0;
  count = 0;
  time = 1800;
  // value
  status: number | undefined;
  first = 0;
  pageRow = 50;
  needReset = false;
  loading: boolean;
  ProjectString: string;
  scroll: Scroll;
  sizeForm = 250;
  // form
  reportForm: FormGroup;
  optionType: OptionField[];
  // called by Angular after jobcard-waiting component initialized
  ngOnInit(): void {
    if (!this.optionType) {
      this.optionType = [
        { label: 'Tools',  value: 1 },
        { label: 'Machines',  value: 2 },
        { label: 'Other & Service',  value: 4 },
      ];
    }

    this.datasource = new Array;
    this.buildForm();
  }

  // destroy
  ngOnDestroy(): void {
    if (this.subscription) {
      // prevent memory leak when component destroyed
      this.subscription.unsubscribe();
    }
  }

  // build form
  buildForm(): void {
    this.scroll = {
      WhereId: this.status || 1,
    };

    this.reportForm = this.fb.group({
      Filter: [this.scroll.Filter],
      SortField: [this.scroll.SortField],
      SortOrder: [this.scroll.SortOrder],
      TotalRow: [this.scroll.TotalRow],
      SDate: [this.scroll.SDate],
      EDate: [this.scroll.EDate],
      Where: [this.scroll.Where],
      WhereId: [this.scroll.WhereId],
      Where2: [this.scroll.Where2],
      WhereId2: [this.scroll.WhereId2],
      Where3: [this.scroll.Where3],
      WhereId3: [this.scroll.WhereId3],
      Where4: [this.scroll.Where4],
      WhereId4: [this.scroll.WhereId4],
      Where5: [this.scroll.Where5],
      WhereId5: [this.scroll.WhereId5],
      OptionString: [''],
      Skip: [this.scroll.Skip],
      Take: [this.scroll.Take],
    });

    this.reportForm.valueChanges.pipe(debounceTime(250), distinctUntilChanged())
      .subscribe((data: any) => this.onValueChanged(data));

    const ControlMoreActivities: AbstractControl | undefined = this.reportForm.get('Filter');
    if (ControlMoreActivities) {
      ControlMoreActivities.valueChanges
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
    this.onGetData(this.scroll);
  }

  // get request data
  onGetData(schedule: Scroll): void {
    // debug here
    // console.log(schedule);

    this.loading = true;
    this.service.getRequireMaintenanceSchedule(schedule)
      .subscribe(dbData => {
        if (!dbData || !dbData.dataTable) {
          this.totalRecords = 0;
          this.columns = new Array;
          this.datasource = new Array;
          // this.reloadData();
          this.loading = false;
          return;
        }

        this.totalRecords = dbData.totalRow || 0;
        this.columns = new Array;
        this.columns = [
          { field: 'RequireDate', header: 'Date', width: 100 , format : Format.Date},
          { field: 'Tools', header: 'Tools Group', width: 250 , type : ColumnType.Option1},
          { field: 'Machines', header: 'Machines Group', width: 250 , type : ColumnType.Option1},
          { field: 'Others', header: 'Others & Service Group', width: 250 , type : ColumnType.Option1},
        ];

        this.datasource = dbData.dataTable.slice();
        if (this.needReset) {
          this.first = 0;
          this.needReset = false;
        }

        // this.reloadData();
      }, error => {
        this.totalRecords = 0;
        this.columns = new Array;
        this.datasource = new Array;
        // this.reloadData();
      }, () => this.loading = false);
  }

  // reload data
  reloadData(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    // this.subscription = Observable.interval(1000)
    //  .take(this.time).map((x) => x + 1)
    //  .subscribe((x) => {
    //    this.message = this.time - x;
    //    this.count = (x / this.time) * 100;
    //    if (x === this.time) {
    //      if (this.reportForm.value) {
    //        this.onGetData(this.reportForm.value);
    //      }
    //    }
    //  });
    /*
    const result = interval(this.time)
      .pipe(
        take(this.time),
        map((x) => {
          this.message = this.time - x;
          this.count = (x / this.time) * 100;
          if (x === (this.time-1)) {
            if (this.reportForm.value) {
              this.onGetData(this.reportForm.value);
            }
          }
        })
      );
    this.subscription = result.subscribe();
    */
  }

  // open dialog
  openDialog(type?: string): void {
    if (type) {
      if (type === 'Project') {
        this.serviceDialogs.dialogSelectProject(this.viewContainerRef)
          .subscribe(project => {
            if (project) {
              this.needReset = true;
              this.reportForm.patchValue({
                WhereId2: project.ProjectCodeMasterId,
                Where2: `${project.ProjectCode}/${project.ProjectName}`,
              });
            }
          });
      }
    }
  }

  // reset
  resetFilter(): void {
    this.datasource = new Array;
    this.scroll = undefined;
    this.loading = true;
    this.buildForm();
    this.onGetData(this.scroll);
  }

  // load Data Lazy
  loadDataLazy(event: LazyLoadEvent): void {
    // in a real application, make a remote request to load data using state metadata from event
    // event.first = First row offset
    // event.rows = Number of rows per page
    // event.sortField = Field name to sort with
    // event.sortOrder = Sort order as number, 1 for asc and -1 for dec
    // filters: FilterMetadata object having field as key and filter value, filter matchMode as value
    this.pageRow = (event.rows || 50);
    // imitate db connection over a network
    this.reportForm.patchValue({
      Skip: event.first,
      Take: (event.rows || 50),
      SortField: event.sortField,
      SortOrder: event.sortOrder,
    });
  }

  // on selected data
  onSelectRow(master?: RequireMTVm): void {
    if (master) {
      if (master.ItemMaintenanceId) {
        this.serviceDialogs.dialogSelectItemMaintenance(master.ItemMaintenanceId, this.viewContainerRef, true)
          .subscribe(condition => {
            if (condition) {
              if (condition === 1) {
                this.router.navigate(['maintenance/actual-info/', master.ItemMaintenanceId]);
              }
            }
          });
      } else {
        this.serviceDialogs.dialogSelectRequireMaintenance(master.RequireMaintenanceId, this.viewContainerRef)
          .subscribe(conditionNumber => {
            if (conditionNumber) {
              if (conditionNumber === -1) {
                this.onUpdateRequireMaintenance(master.RequireMaintenanceId);
                setTimeout(() => { this.onGetData(this.reportForm.value); }, 750);
              } else if (conditionNumber === 1) {
                this.router.navigate(['maintenance/', master.RequireMaintenanceId]);
              }
            }
          });
      }
    }
  }

  // RequireMaintenance Has Action
  onUpdateRequireMaintenance(RequireMaintenanceId: number): void {
    this.service.actionRequireMaintenance(RequireMaintenanceId, (this.serviceAuth.getAuth.UserName || ''))
      .subscribe();
  }

  // get report data
  onReport(): void {
    if (this.reportForm && this.reportForm.valid) {
      const scorll = this.reportForm.getRawValue() as Scroll;

      this.loading = true;
      scorll.Skip = 0;
      scorll.Take = this.totalRecords;
      this.service.getXlsx(scorll, 'MaintenanceWaitingReport/').subscribe(data => {
        // console.log(data);
        this.loading = false;
      }, () => {
        this.loading = false;
        this.serviceDialogs.error('System message', 'Can\'t export file !!!', this.viewContainerRef);
      }, () => this.loading = false);
    }

  }
}
