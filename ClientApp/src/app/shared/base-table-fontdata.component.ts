// Angular Core
import { Component, OnInit, ViewChild, Input, Output, EventEmitter, AfterViewInit, OnChanges } from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource, MatCheckbox } from "@angular/material";
import { SelectionModel } from '@angular/cdk/collections';
// Rxjs

// Module

export class BaseTableFontData<Model> implements OnInit, OnChanges, AfterViewInit {
  /** custom-mat-table ctor */
  constructor() { }

  // Parameter
  displayedColumns: Array<string> = ["select", "Col1", "Col2", "Col3"];
  @Input() dataRows: Array<Model>;
  @Input() readOnly: boolean = false;
  @Output() returnSelected: EventEmitter<{ data: Model, option: number }> = new EventEmitter<{ data: Model, option: number }>();

  // Parameter MatTable
  dataSource = new MatTableDataSource<Model>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selection = new SelectionModel<Model>(false, [], true);

  // Parameter Component
  resultsLength = 0;
  isLoadingResults = false;
  isRateLimitReached = false;
  selectedRow: Model;

  ngOnChanges() {
    this.dataSource = new MatTableDataSource<Model>(this.dataRows);
  }

  // Angular NgOnInit
  ngOnInit() {
    // this.dataSource = new MatTableDataSource<Model>(new Array);

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
  onActionClick(data: any, mode: number = 0) {
    this.returnSelected.emit({ data: data, option: mode });
  }
}

