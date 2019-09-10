import { Component,OnInit, OnDestroy, ViewContainerRef, HostListener } from "@angular/core";
import { FormBuilder, FormGroup, AbstractControl } from "@angular/forms";
import { Subscription, Observable } from "rxjs";
import { LazyLoadEvent } from "primeng/primeng";
import { debounceTime, distinctUntilChanged, map, take } from "rxjs/operators";
import { ItemService } from '../shared/item.service';
import { DialogsService } from 'src/app/dialogs/shared/dialogs.service';
import { Item } from '../shared/item.model';
import { MyPrimengColumn, Format } from 'src/app/shared/column.model';
import { Scroll } from 'src/app/shared/scroll.model';
import { ScrollData } from 'src/app/shared/scroll-data.model';
import { ItemTypeService } from 'src/app/item-types/shared/item-type.service';
import { ItemType } from 'src/app/item-types/shared/item-type.model';


@Component({
  selector: 'app-item-master-list',
  templateUrl: './item-master-list.component.html',
  styleUrls: ['./item-master-list.component.scss']
})
export class ItemMasterListComponent implements OnInit, OnDestroy {

  constructor(
    private service: ItemService,
    private serviceItemType: ItemTypeService,
    private fb: FormBuilder,
    private viewCon: ViewContainerRef,
    private serviceDialogs: DialogsService,
  ) {
    // 100 for bar | 200 for titil and filter
    this.mobHeight = (window.innerHeight - this.sizeForm) + "px";
  }

  //Parameter
  datasource: Array<Item>;
  totalRecords: number;
  loading: boolean;
  subscription: Subscription;
  columns: Array<MyPrimengColumn>;
  columnUppers: Array<MyPrimengColumn>;
  // ScrollData
  scroll: Scroll;
  reportForm: FormGroup;
  rowPage: number = 25;
  first: number = 0;
  needReset: boolean = false;
  mobHeight: string = "50px";;
  sizeForm: number = 220;
  // Data
  itemTypes: Array<ItemType>;

  ngOnInit() {
    // Get ItemType
    if (!this.itemTypes) {
      this.itemTypes = new Array;
    }
    this.serviceItemType.getAll()
      .subscribe(dbItemType => {
        this.itemTypes = [...dbItemType];
      });

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
    this.service.getAllWithScroll(schedule)
      .subscribe((dbData: ScrollData<Item>) => {
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
          { field: 'ItemCode', header: 'Code', width: 125, },
          { field: 'Name', header: 'Name', width: 250, },
          { field: 'Model', header: 'Model', width: 150, },
          { field: 'Brand', header: 'Brand', width: 150, },
          { field: 'Property', header: 'S/N', width: 175, },
          { field: 'BranchString', header: 'Branch', width: 150, },
          { field: 'EmpResposibleString', header: 'Employee', width: 200, },
          { field: 'GroupMisString', header: 'Group', width: 200, },
          { field: 'RegisterDate', header: 'Register', width: 175, format: Format.Date },
          { field: 'CancelDate', header: 'Cancel', width: 175, format: Format.Date },

          // { field: 'LocationStock', header: 'Location', width: 125, },
          // { field: 'InternelStockString', header: 'StockByLocation', width: 250, },
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
    if (this.reportForm) {
      let scorll = this.reportForm.getRawValue() as Scroll;
      this.loading = true;
      // Set take all record
      scorll.Skip = 0;
      scorll.Take = this.totalRecords;
      this.service.getXlsxScroll(scorll).subscribe(data => {
        //console.log(data);
        this.loading = false;
      });
    }
  }

  @HostListener('window:resize', ['$event'])
  @debounceFunc()
  onResize(event) {
    // console.log("innerWidth", event.target.innerWidth);
    // console.log("innerHeight", event.target.innerHeight);

    this.mobHeight = (event.target.innerHeight - this.sizeForm) + "px";
  }
}

export function debounceFunc(delay: number = 300): MethodDecorator {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let timeout = null

    const original = descriptor.value;

    descriptor.value = function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => original.apply(this, args), delay);
    };

    return descriptor;
  };
}
