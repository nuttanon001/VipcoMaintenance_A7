// Angular Core
import { Component, OnInit, ViewChild, Input, Output, EventEmitter, AfterViewInit, OnChanges } from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource, MatCheckbox } from "@angular/material";
import { SelectionModel } from '@angular/cdk/collections';
// Rxjs
import { map } from "rxjs/operators/map";
import { Observable } from "rxjs/Observable";
import { merge } from "rxjs/observable/merge";
import { startWith } from "rxjs/operators/startWith";
import { switchMap } from "rxjs/operators/switchMap";
import { catchError } from "rxjs/operators/catchError";
import { of as observableOf } from "rxjs/observable/of";
// Module
import { Item } from "../shared/item.model";

@Component({
  selector: 'app-item-by-group-detail-table',
  templateUrl: './item-by-group-detail-table.component.html',
  styleUrls: ['./item-by-group-detail-table.component.scss']
})
export class ItemByGroupDetailTableComponent implements OnInit, OnChanges, AfterViewInit {
  /** custom-mat-table ctor */
  constructor() { }

  // Parameter
  displayedColumns: Array<string> = ["select", "ItemCode", "Name", "GroupMisString", "edit"];
  @Input() items: Array<Item>;
  @Input() readOnly: boolean = false;
  @Output() returnSelected: EventEmitter<{ data: Item, mode: number }> = new EventEmitter<{ data: Item, mode: number }>();

  // Parameter MatTable
  dataSource = new MatTableDataSource<Item>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selection = new SelectionModel<Item>(false, [], true);

  // Parameter Component
  resultsLength = 0;
  isLoadingResults = false;
  isRateLimitReached = false;
  selectedRow: Item;

  ngOnChanges() {
    // console.log("ONChange", JSON.stringify(this.requisitions));
    this.dataSource = new MatTableDataSource<Item>(this.items);
  }

  // Angular NgOnInit
  ngOnInit() {
    // this.dataSource = new MatTableDataSource<RequisitionStock>(new Array);

    // If the user changes the sort order, reset back to the first page.
    this.selection.onChange.subscribe(selected => {
      if (selected.source.selected[0]) {
        this.selectedRow = selected.source.selected[0];
        // this.returnSelected.emit(selected.source.selected[0]);
      }
    });
  }
  // Angular ngAfterViewInit
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  // OnAction Click
  onActionClick(data: any, mode: number) {
    this.returnSelected.emit({ data: data, mode: mode });
  }
}

