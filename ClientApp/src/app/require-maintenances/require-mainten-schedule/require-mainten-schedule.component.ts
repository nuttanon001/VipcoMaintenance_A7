import { Component, OnInit, OnDestroy, ViewContainerRef, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
// rxjs
import { Observable, Subscription, interval } from "rxjs";
import { debounceTime, distinctUntilChanged, map, take } from "rxjs/operators";
// model
import { OptionRequireMaintenance } from "../shared/option-require-maintenance.model";
import { RequireMaintenance } from "../shared/require-maintenance.model";
// 3rd patry
import { LazyLoadEvent } from "primeng/primeng";
// service
import { DialogsService } from "../../dialogs/shared/dialogs.service";
import { AuthService } from "../../core/auth/auth.service";
import { RequireMaintenService } from "../shared/require-mainten.service";
import { MyPrimengColumn, ColumnType } from 'src/app/shared/column.model';

@Component({
  selector: "app-require-mainten-schedule",
  templateUrl: "./require-mainten-schedule.component.html",
  styleUrls: ["./require-mainten-schedule.component.scss"]
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
    this.scrollHeight = (window.innerHeight - this.sizeForm) + "px"; 
  }

  // Parameter
  // model
  columns: Array<MyPrimengColumn>;
  totalRecords: number = 0;
  datasource: Array<any>;
  scrollHeight: string;
  subscription: Subscription;
  // time
  message: number = 0;
  count: number = 0;
  time: number = 1800;
  // value
  status: number | undefined;
  first: number = 0;
  pageRow: number = 50;
  needReset: boolean = false;
  loading: boolean;
  ProjectString: string;
  schedule: OptionRequireMaintenance;
  sizeForm: number = 250;
  // form
  reportForm: FormGroup;

  // called by Angular after jobcard-waiting component initialized
  ngOnInit(): void {
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
    this.schedule = {
      Status: this.status || 1,
    };

    this.reportForm = this.fb.group({
      Filter: [this.schedule.Filter],
      ProjectId: [this.schedule.ProjectId],
      ProjectString: [this.ProjectString],
      SortField: [this.schedule.SortField],
      SortOrder: [this.schedule.SortOrder],
      SDate: [this.schedule.SDate],
      EDate: [this.schedule.EDate],
      Status: [this.schedule.Status],
      Skip: [this.schedule.Skip],
      Take: [this.schedule.Take],
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
  }

  // on value change
  onValueChanged(data?: any): void {
    if (!this.reportForm) { return; }
    this.schedule = this.reportForm.value;
    this.onGetData(this.schedule);
  }

  // get request data
  onGetData(schedule: OptionRequireMaintenance): void {
    this.loading = true;
    this.service.getRequireMaintenanceSchedule(schedule)
      .subscribe(dbData => {
        if (!dbData || !dbData.DataTable) {
          this.totalRecords = 0;
          this.columns = new Array;
          this.datasource = new Array;
          this.reloadData();
          this.loading = false;
          return;
        }

        this.totalRecords = dbData.TotalRow || 0;
        this.columns = new Array;
        this.columns = [
          { field: 'ItemTypeName', header: 'Group item.', width: 100 },
        ];
        
        let i: number = 0;
        for (let name of dbData.Columns) {
          this.columns.push({
            header: name, field: name, width: 250, type: ColumnType.Option1,
          });
        }

        this.datasource = dbData.DataTable.slice();
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

  // reload data
  reloadData(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    //this.subscription = Observable.interval(1000)
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
  }

  // open dialog
  openDialog(type?: string): void {
    if (type) {
      if (type === "Project") {
        this.serviceDialogs.dialogSelectProject(this.viewContainerRef)
          .subscribe(project => {
            if (project) {
              this.needReset = true;
              this.reportForm.patchValue({
                ProjectId: project.ProjectCodeMasterId,
                ProjectString: `${project.ProjectCode}/${project.ProjectName}`,
              });
            }
          });
      }
    }
  }

  // reset
  resetFilter(): void {
    this.datasource = new Array;
    this.schedule = undefined;
    this.loading = true;
    this.buildForm();
    this.onGetData(this.schedule);
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
  onSelectRow(master?: RequireMaintenance): void {
    if (master) {
      if (master.ItemMaintenanceId) {
        this.serviceDialogs.dialogSelectItemMaintenance(master.ItemMaintenanceId, this.viewContainerRef,true)
          .subscribe(condition => {
            if (condition) {
              if (condition === 1) {
                this.router.navigate(["maintenance/actual-info/", master.ItemMaintenanceId]);
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
                this.router.navigate(["maintenance/", master.RequireMaintenanceId]);
              }
            }
          });
      }
    }
  }

  // RequireMaintenance Has Action
  onUpdateRequireMaintenance(RequireMaintenanceId:number): void {
    this.service.actionRequireMaintenance(RequireMaintenanceId, (this.serviceAuth.getAuth.UserName || ""))
      .subscribe();
  }
}
