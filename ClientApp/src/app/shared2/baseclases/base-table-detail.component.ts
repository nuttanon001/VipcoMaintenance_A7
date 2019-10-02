// Angular Core
import { OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, AfterViewInit } from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { SelectionModel } from '@angular/cdk/collections';
// Models
import { ResueaColumn } from "../basemode/resuea-column.model";
// Services

export class BaseTableDetailComponent<Model> implements OnInit, OnChanges, AfterViewInit {
  /** custom-mat-table ctor */
  constructor() { }

  // Parameter
  columns: Array<ResueaColumn<Model>>;
  //columns: any;
  displayedColumns: Array<string> = ["select", "Col1", "Col2", "Col3"];
  @Input() dataRows: Array<Model>;
  @Input() readOnly: boolean = false;
  @Input() fastSelected: boolean = false;
  @Output() returnSelectedWith: EventEmitter<{ data: Model, option: number }> = new EventEmitter<{ data: Model, option: number }>();

  // Parameter MatTable
  dataSource = new MatTableDataSource<Model>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selection = new SelectionModel<Model>(false, [], true);
  // Parameter Component
  resultsLength = 0;
  isLoadingResults = true;
  selectedRow: Model;

  // Angular NgOnInit
  ngOnInit() {
    // this.dataSource = new MatTableDataSource<Model>(new Array);
    // If the user changes the sort order, reset back to the first page.
    this.selection.onChange.subscribe(selected => {
      // Added
      if (selected.added && selected.added.length > 0) {
        if (selected.added[0]) {
          this.selectedRow = selected.added[0];
          this.returnSelectedWith.emit({ data: this.selectedRow, option: 1 });
        }
      }
      // Remove
      if (selected.removed && selected.removed.length > 0) {
        selected.removed.forEach(item => {
          if (item === this.selectedRow) {
            this.selectedRow = undefined;
          }
        });
      }
    });
  }

  ngOnChanges() {
    //debug here
    // console.log(JSON.stringify(this.dataRows));

    this.dataSource = new MatTableDataSource<Model>(this.dataRows);
    this.resultsLength = this.dataRows ? this.dataRows.length : 0;
  }

  // Angular ngAfterViewInit
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  // OnAction Click
  onActionClick(data: Model, option: number = 0) {
    this.returnSelectedWith.emit({ data: data, option: option });
  }
}
