// Angular Core
import { Component } from "@angular/core";
import { SelectionModel } from "@angular/cdk/collections";
// Components
import { CustomMatTableComponent } from "../../shared/custom-mat-table/custom-mat-table.component";
// Models
import { Item } from "../shared/item.model";
import { ItemByGroup } from "../shared/item-by-group.model";
import { Scroll } from "../../shared/scroll.model";
// Services
import { AuthService } from "../../core/auth/auth.service";
import { ItemService } from "../shared/item.service";
import { merge, of } from "rxjs";
import { catchError, map, startWith, switchMap } from "rxjs/operators";
import { ScrollData } from "src/app/shared2/basemode/scroll-data.model";
// Rxjs


@Component({
  selector: 'app-item-by-group-table',
  templateUrl: './item-by-group-table.component.html',
  styleUrls: ['./item-by-group-table.component.scss']
})
export class ItemByGroupTableComponent extends CustomMatTableComponent<ItemByGroup, ItemService>{
  // Constructor
  constructor(
    service: ItemService,
    authService: AuthService,
  ) {
    super(service, authService);
    this.displayedColumns = ["select", "GroupMisString", "ItemCount"];
  }

  // Angular NgOnInit
  ngOnInit() {
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
          return this.service.getAllWithScroll(scroll,"ItemByGroupWithScroll/");
        }),
        map((data : ScrollData<ItemByGroup>) => {
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
          return of([])
        })
      ).subscribe(data => this.dataSource.data = data);
    // Selection
    this.selection = new SelectionModel<Item>(this.isMultiple, [], true)
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
    this.service.getAllWithScroll(scroll, "ItemByGroupWithScroll/").subscribe(dbData => {
      this.isLoadingResults = false;
      this.isRateLimitReached = false;
      // Set Data
      this.resultsLength = dbData.Scroll.TotalRow;
      this.dataSource.data = dbData.Data;
    });
  }
}
