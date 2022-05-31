// Angular Core
import { OnInit, ViewChild, Input, Output,EventEmitter } from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource, MatCheckbox } from "@angular/material";
import { SelectionModel } from '@angular/cdk/collections';
// Rxjs

// Models
import { Scroll } from "../scroll.model";
// Component
import { SearchBoxComponent } from "../search-box/search-box.component";
// Services
import { BaseRestService } from "../base-rest.service";
import { AuthService } from "../../core/auth/auth.service";
import { catchError, debounce, map, startWith, switchMap } from "rxjs/operators";
import { merge, of } from "rxjs";

//@Component({
//  selector: "app-custom-mat-table",
//  templateUrl: "./custom-mat-table.component.html",
//  styleUrls: ["./custom-mat-table.component.scss"],
//})

/** custom-mat-table component*/
export class CustomMatTableComponent<Model,Service extends BaseRestService<Model>> implements OnInit {
  /** custom-mat-table ctor */
  constructor(
    protected service: Service,
    protected authService: AuthService,
  ) { }

  // Parameter
  displayedColumns: Array<string> = ["select", "Col1", "Col2", "Col3"];
  @Input() isOnlyCreate: boolean = false;
  @Input() isDisabled: boolean = true;
  @Input() isMultiple: boolean = false;
  @Output() returnSelected: EventEmitter<Model> = new EventEmitter<Model>();
  @Output() returnSelectesd: EventEmitter<Array<Model>> = new EventEmitter<Array<Model>>();

  // Parameter MatTable
  dataSource = new MatTableDataSource<Model>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(SearchBoxComponent) searchBox: SearchBoxComponent;
  selection:SelectionModel<Model>;

  // Parameter Component
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  selectedRow: Model;

  // Angular NgOnInit
  ngOnInit() {
    this.searchBox.onlyCreate2 = this.isOnlyCreate;
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    // Merge
    merge(this.sort.sortChange, this.paginator.page, this.searchBox.search, this.searchBox.onlyCreate)
      .pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        let scroll: Scroll = {
          Skip: this.paginator.pageIndex * this.paginator.pageSize,
          Take: this.paginator.pageSize,
          Filter: this.searchBox.search2,
          SortField: this.sort.active,
          SortOrder: this.sort.direction === "desc" ? 1 : -1,
          Where: this.searchBox.onlyCreate2 ? this.authService.getAuth.UserName || "" : ""
        };
        return this.service.getAllWithScroll(scroll);
      }),
      map(data => {
        // Flip flag to show that loading has finished.
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = data.Scroll.TotalRow;
        return data.Data;
      }),
      catchError(() => {
        this.isLoadingResults = false;
        // Catch if the GitHub API has reached its rate limit. Return empty data.
        this.isRateLimitReached = true;
        return of([]);
      })
    ).subscribe(data => this.dataSource.data = data);
    // Selection
    this.selection = new SelectionModel<Model>(this.isMultiple, [], true)
    this.selection.onChange.subscribe(selected => {
      if (this.isMultiple) {
        if (selected.source) {
          // this.selectedRow = selected.source.selected[0];
          this.returnSelectesd.emit(selected.source.selected);
        }
      } else {
        if (selected.source.selected[0]) {
          this.selectedRow = selected.source.selected[0];
          this.returnSelected.emit(selected.source.selected[0]);
        }
      }
    });
  }

  reloadData(): void {
    let scroll: Scroll = {
      Skip: 0,
      Take: this.paginator.pageSize,
      Filter: this.searchBox.search2,
      SortField: this.sort.active,
      SortOrder: this.sort.direction === "desc" ? 1 : -1,
      Where: this.searchBox.onlyCreate2 ? this.authService.getAuth.UserName || "" : ""
    };
    this.service.getAllWithScroll(scroll).subscribe(dbData => {
      this.isLoadingResults = false;
      this.isRateLimitReached = false;
      // Set Data
      this.resultsLength = dbData.Scroll.TotalRow;
      this.dataSource.data = dbData.Data;
    });
  }
}

