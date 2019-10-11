// Angular Core
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
// Components
import { BaseTableComponent } from 'src/app/shared2/baseclases/base-table.component';
// Services
import { AuthService } from 'src/app/core/auth/auth.service';
import { ItemMk2Service } from 'src/app/items/shared/item-mk2.service';
// Models
import { Item } from 'src/app/items/shared/item.model';
import { Scroll } from 'src/app/shared2/basemode/scroll.model';
// Rxjs
import {
  map, startWith,
  switchMap, catchError, debounceTime, distinctUntilChanged,
} from "rxjs/operators";
import { of as observableOf, merge, Observable } from 'rxjs';
import { ItemType } from 'src/app/item-types/shared/item-type.model';
import { ItemTypeService } from 'src/app/item-types/shared/item-type.service';

@Component({
  selector: 'app-item-mk2-table' ,
  templateUrl: './item-mk2-table.component.html' ,
  styleUrls: [ './item-mk2-table.component.scss' ],
  providers: [ ItemTypeService ]
})
export class ItemMk2TableComponent
  extends BaseTableComponent<Item, ItemMk2Service> {
  constructor(
    service: ItemMk2Service,
    serviceAuth: AuthService,
    private serviceItemType:ItemTypeService,
    private fb: FormBuilder
  ) {
    super(service, serviceAuth);

    this.columns = [
      { columnName: "Code", columnField: "ItemCode", cell: (row: Item) => row.ItemCode },
      { columnName: "Name", columnField: "Name", cell: (row: Item) => row.Name },
      { columnName: "Branch", columnField: "Model", cell: (row: Item) => row.Model },
      { columnName: "WorkGroup", columnField: "GroupMisString", cell: (row: Item) => row.GroupMisString },
    ];

    this.displayedColumns = this.columns.map(x => x.columnField);
    // this.displayedColumns.splice(0, 0, "Command");
    this.displayedColumns.splice(0, 0, "select");
    this.isOnlyCreate = false;
    this.Option = true;
    this.isKeyIndex = "ItemId";
    this.isSubAction = "GetScrollMk2/";
  }
  // Parameter
  @Input() Option: boolean = false;
  itemTypes: Array<ItemType>;
  itemForm?: FormGroup;
  item?: item;

  // Angular NgOnInit
  ngOnInit() {
    this.getLocation();
    // Bulid form
    this.bulidForm();

    this.templateSelect = new Array;
    if (this.searchBox) {
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

    merge(this.sort.sortChange, this.paginator.page, this.searchBox.search,
      this.searchBox.onlyCreate, this.itemForm.valueChanges)
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
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
            WhereId2: (this.itemForm.value as item).ItemTypeId || undefined,
            WhereId3: this.Option ? 1 : undefined,
            WhereId: this.WhereId
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
        if (this.templateSelect && this.templateSelect.length > 0) {
          this.dataSource.data.forEach(row => {
            if (this.isKeyIndex) {
              this.templateSelect.forEach(value => {
                if (value[this.isKeyIndex].toString() === row[this.isKeyIndex].toString()) {
                  this.selection.select(row)
                }
              });
            }
            else {
              if (deepIndexOf(this.templateSelect, row) !== -1) {
                this.selection.select(row)
              }
            }
          });
        }
      });

    // Selection
    this.selection = new SelectionModel<Item>(this.isMultiple, [], true);
    this.selection.onChange.subscribe(selected => {
      // Added
      if (selected.added && selected.added.length > 0) {
        // if 
        if (this.isMultiple) {
          selected.added.forEach(item => {
            if (this.isKeyIndex) {
              if (this.templateSelect.findIndex(template => template[this.isKeyIndex] === item[this.isKeyIndex]) === -1) {
                this.templateSelect.push(Object.assign({}, item));
              }
            }
            else {
              if (deepIndexOf(this.templateSelect, item) === -1) {
                this.templateSelect.push(Object.assign({}, item));
              }
            }
            this.selectedRow = item;
          });
          this.returnSelectesd.emit(this.templateSelect);
        }
        else {
          if (selected.added[0]) {
            this.selectedRow = selected.added[0];
            this.returnSelected.emit(selected.added[0]);
          }
        }
      }
      // Remove
      if (selected.removed && selected.removed.length > 0) {
        selected.removed.forEach(item => {
          if (this.isKeyIndex) {
            if (this.templateSelect && this.templateSelect.length > 0) {
              this.templateSelect.forEach((value, index) => {
                if (value[this.isKeyIndex].toString() === item[this.isKeyIndex].toString()) {
                  this.templateSelect.splice(index, 1);
                }
              });
            }
          }
          else {
            if (this.templateSelect && this.templateSelect.length > 0) {
              let index = deepIndexOf(this.templateSelect, item);
              // console.log("Remove", index);
              this.templateSelect.splice(index, 1);
            }
          }

          if (item === this.selectedRow) {
            this.selectedRow = undefined;
            this.returnSelected.emit(undefined);
          }
        });
      }
    });
  }

  // Bulid Form;
  bulidForm(): void {
    this.item = {
      ItemTypeId: 0,
    };

    this.itemForm = this.fb.group({
      ItemTypeId: [this.item.ItemTypeId],
    });
  }

  // Get Location
  getLocation(): void {
    if (!this.itemTypes) {
      this.serviceItemType.getAll()
        .subscribe(dbItemType => {
          this.itemTypes = dbItemType ? dbItemType.slice() : new Array;
        });
    }
  }
}

export interface item {
  ItemTypeId: number,
}

function deepIndexOf(arr, obj) {
  return arr.findIndex(function (cur) {
    return Object.keys(obj).every(function (key) {
      return obj[key] === cur[key];
    });
  });
}
