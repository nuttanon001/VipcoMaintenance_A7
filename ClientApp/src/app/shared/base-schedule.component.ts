import { OnInit, OnDestroy, ViewContainerRef } from "@angular/core";
import { FormBuilder, FormGroup, AbstractControl } from "@angular/forms";
import { BaseRestService } from "./base-rest.service";
import { DialogsService } from "../dialogs/shared/dialogs.service";
import { Subscription, Observable } from "rxjs";
import { MyPrimengColumn } from "./column.model";
import { Scroll } from "./scroll.model";
import { LazyLoadEvent } from "primeng/primeng";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

export abstract class BaseScheduleComponent<Model,Service extends BaseRestService<Model>> implements OnInit, OnDestroy {
  constructor(
    public service: Service,
    public fb: FormBuilder,
    public viewCon: ViewContainerRef,
    public serviceDialogs:DialogsService
  ) { }

  //Parameter
  datasource: Array<Model>;
  totalRecords: number;
  loading: boolean;
  subscription: Subscription;
  columns: Array<MyPrimengColumn>;
  columnUppers: Array<MyPrimengColumn>;
  //TimeReload
  message: number = 0;
  count: number = 0;
  time: number = 300;
  // ScrollData
  scroll: Scroll;
  reportForm: FormGroup;
  first: number = 0;
  needReset: boolean = false;

  ngOnInit() {
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
  }

  // on value change
  onValueChanged(data?: any): void {
    if (!this.reportForm) { return; }
    this.scroll = this.reportForm.value;
    if (!this.loading) {
      this.loading = true;
      this.onGetData(this.scroll);
    }
  }

  // get request data
  abstract onGetData(schedule: Scroll): void;

  // load Data Lazy
  loadDataLazy(event: LazyLoadEvent): void {
    // in a real application, make a remote request to load data using state metadata from event
    // event.first = First row offset
    // event.rows = Number of rows per page
    // event.sortField = Field name to sort with
    // event.sortOrder = Sort order as number, 1 for asc and -1 for dec
    // filters: FilterMetadata object having field as key and filter value, filter matchMode as value

    // imitate db connection over a network
    this.reportForm.patchValue({
      Skip: event.first,
      Take: (event.rows || 15),
      SortField: event.sortField,
      SortOrder: event.sortOrder,
    });
  }

  // reset
  resetFilter(): void {
    this.datasource = new Array;
    this.scroll = undefined;
    // this.loading = true;
    this.buildForm();
    this.onGetData(this.scroll);
  }

  // reload data
  reloadData(): void {
    /*
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = Observable.interval(1000)
      .take(this.time).map((x) => x + 1)
      .subscribe((x) => {
        this.message = this.time - x;
        this.count = (x / this.time) * 100;
        if (x === this.time) {
          if (this.reportForm.value) {
            this.onGetData(this.reportForm.value);
          }
        }
      });
    */
  }

  // Open Dialog
  abstract onShowDialog(type?: string): void;
 
}
