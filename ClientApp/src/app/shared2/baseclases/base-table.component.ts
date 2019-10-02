// Angular Core
import { OnInit, ViewChild, Input, Output, EventEmitter, OnDestroy } from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource, MatCheckbox } from "@angular/material";
import { SelectionModel } from '@angular/cdk/collections';
// Rxjs
import {
  map, startWith,
  switchMap, catchError,
} from "rxjs/operators";
import { of as observableOf, merge, Observable } from 'rxjs';
// Models
import { Scroll } from "../basemode/scroll.model";
import { ResueaColumn } from "../basemode/resuea-column.model";
// Component
import { SearchBox2Component } from "../search-box/search-box.component";
// Services
import { BaseRestService } from "./base-rest.service";
//rxjs
import * as moment from "moment";
import { AuthService } from 'src/app/core/auth/auth.service';

export class BaseTableComponent<Model, Service extends BaseRestService<Model>> implements OnInit {
  /** custom-mat-table ctor */
  constructor(
    protected service: Service,
    protected authService: AuthService,
  ) {
    moment.locale('th-TH');
  }
  // Parameter
  columns: Array<ResueaColumn<Model>>;
  //columns: any;
  displayedColumns: Array<string> = ["select", "Col1", "Col2", "Col3"];
  @Input() isOnlyCreate: boolean = false;
  @Input() isDisabled: boolean = true;
  @Input() isKeyIndex: any;
  @Input() isMultiple: boolean = false;
  @Input() isDialog: boolean = false;
  @Input() WhereId: number | undefined;
  @Input() Where: string | undefined;
  @Input() isSubAction: string = "GetScroll/";
  @Input() OptionFilter: Scroll;

  @Output() returnSelected: EventEmitter<Model> = new EventEmitter<Model>();
  @Output() returnSelectesd: EventEmitter<Array<Model>> = new EventEmitter<Array<Model>>();
  @Output() returnSelectedWith: EventEmitter<{ data: Model, option: number }> = new EventEmitter<{ data: Model, option: number }>();
  @Output() filter: EventEmitter<Scroll> = new EventEmitter<Scroll>();
  // Parameter MatTable
  dataSource = new MatTableDataSource<Model>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(SearchBox2Component) searchBox: SearchBox2Component;
  selection: SelectionModel<Model>;
  subscribe: Observable<any>;
  // Parameter Component
  templateSelect: Array<Model>;
  resultsLength = 0;
  isLoadingResults = true;
  selectedRow: Model;

  // Angular NgOnInit
  ngOnInit() {
    this.templateSelect = new Array;
    if (this.searchBox)
    {
      this.searchBox.onlyCreate2 = this.isOnlyCreate;
      // console.log(this.searchBox.onlyCreate2);
    }
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.searchBox.search.subscribe(() => this.paginator.pageIndex = 0);
    // select where
    if (this.OptionFilter) {
      //Set filter
      this.searchBox.setInput = this.OptionFilter.Filter;
      this.searchBox.search2 = this.OptionFilter.Filter;
      //Set page
      this.paginator.pageIndex = this.OptionFilter.Skip / this.OptionFilter.Take;
      this.paginator.pageSize = this.OptionFilter.Take;
      //Set Create
      // if where is define use isOnlyCreate
      this.searchBox.onlyCreate2 = this.OptionFilter.Where ? (this.OptionFilter.Where === "define" ? this.isOnlyCreate : true) : false;
      this.isOnlyCreate = this.searchBox.onlyCreate2;
    }

    merge(this.sort.sortChange, this.paginator.page, this.searchBox.search, this.searchBox.onlyCreate)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          let scroll: Scroll = {
            Skip: this.paginator.pageIndex * this.paginator.pageSize,
            Take: this.paginator.pageSize || 50,
            Filter: this.searchBox.search2,
            SortField: this.sort.active,
            SortOrder: this.sort.direction === "desc" ? 1 : -1,
            Where: this.searchBox.onlyCreate2 ? this.authService.currentUserValue.UserName || "" : "",
            WhereId: this.WhereId,
          };

          // Emit scroll to MasterComponent
          this.filter.emit(scroll);

          return this.service.getAllWithScroll(scroll, this.isSubAction);
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.resultsLength = data.Scroll.TotalRow;
          return data.Data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          return observableOf([]);
        })
      ).subscribe(data => {
        this.dataSource.data = data;
        // Addtion
        if (this.templateSelect && this.templateSelect.length > 0)
        {
          this.dataSource.data.forEach(row => {
            if (this.isKeyIndex)
            {
              this.templateSelect.forEach(value => {
                if (value[this.isKeyIndex].toString() === row[this.isKeyIndex].toString())
                {
                  this.selection.select(row)
                }
              });
            }
            else
            {
              if (deepIndexOf(this.templateSelect, row) !== -1)
              {
                this.selection.select(row)
              }
            }
          });
        }
      });

    // Selection
    this.selection = new SelectionModel<Model>(this.isMultiple, [], true);
    this.selection.onChange.subscribe(selected => {
      // Added
      if (selected.added && selected.added.length > 0)
      {
        // if 
        if (this.isMultiple)
        {
          selected.added.forEach(item => {
            if (this.isKeyIndex)
            {
              if (this.templateSelect.findIndex(template => template[this.isKeyIndex] === item[this.isKeyIndex]) === -1)
              {
                this.templateSelect.push(Object.assign({}, item));
              }
            }
            else
            {
              if (deepIndexOf(this.templateSelect, item) === -1)
              {
                this.templateSelect.push(Object.assign({}, item));
              }
            }
            this.selectedRow = item;
          });
          this.returnSelectesd.emit(this.templateSelect);
        }
        else
        {
          if (selected.added[0])
          {
            this.selectedRow = selected.added[0];
            this.returnSelected.emit(selected.added[0]);
          }
        }
      }
      // Remove
      if (selected.removed && selected.removed.length > 0)
      {
        selected.removed.forEach(item => {
          if (this.isKeyIndex)
          {
            if (this.templateSelect && this.templateSelect.length > 0)
            {
              this.templateSelect.forEach((value, index) => {
                if (value[this.isKeyIndex].toString() === item[this.isKeyIndex].toString())
                {
                  this.templateSelect.splice(index, 1);
                }
              });
            }
          }
          else
          {
            if (this.templateSelect && this.templateSelect.length > 0)
            {
              let index = deepIndexOf(this.templateSelect, item);
              // console.log("Remove", index);
              this.templateSelect.splice(index, 1);
            }
          }

          if (item === this.selectedRow)
          {
            this.selectedRow = undefined;
            this.returnSelected.emit(undefined);
          }
        });
      }
    });
  }
  // Reload
  reloadData(): void {
    //this.paginator.page.emit();
    this.searchBox.search.emit("");
  }
  // OnAction Click
  onActionClick(data: Model, option: number = 0) {
    this.returnSelectedWith.emit({ data: data, option: option });
  }
}

function deepIndexOf(arr, obj) {
  return arr.findIndex(function (cur) {
    return Object.keys(obj).every(function (key) {
      return obj[key] === cur[key];
    });
  });
}
