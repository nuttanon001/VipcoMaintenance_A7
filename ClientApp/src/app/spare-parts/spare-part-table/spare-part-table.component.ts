// Angular Core
import { Component, Input } from "@angular/core";
// Components
import { CustomMatTableComponent } from "../../shared/custom-mat-table/custom-mat-table.component";
// Models
import { SparePart } from "../shared/spare-part.model";
// Services
import { AuthService } from "../../core/auth/auth.service";
import { SparePartService } from "../shared/spare-part.service";

// Rxjs
import { map } from "rxjs/operators/map";
import { Observable } from "rxjs/Observable";
import { merge } from "rxjs/observable/merge";
import { startWith } from "rxjs/operators/startWith";
import { switchMap } from "rxjs/operators/switchMap";
import { catchError } from "rxjs/operators/catchError";
import { of as observableOf } from "rxjs/observable/of";
import { Scroll } from 'src/app/shared2/basemode/scroll.model';
import { FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-spare-part-table',
  templateUrl: './spare-part-table.component.html',
  styleUrls: ['./spare-part-table.component.scss']
})
export class SparePartTableComponent extends CustomMatTableComponent<SparePart, SparePartService>{
  // Constructor
  constructor(
    service: SparePartService,
    authService: AuthService,
  ) {
    super(service, authService);
    this.displayedColumns = ["select", "Code", "Name", "Model", "OnHand"];
  }

  @Input() isDialog: boolean = false;
  codeForm: FormControl;

  // Angular NgOnInit
  ngOnInit() {
    // code form
    this.codeForm = new FormControl("");

    this.searchBox.onlyCreate2 = this.isOnlyCreate;
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    // Merge
    merge(this.sort.sortChange, this.paginator.page, this.searchBox.search, this.searchBox.onlyCreate, this.codeForm.valueChanges.pipe(debounceTime(500), distinctUntilChanged()))
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
            Where: this.codeForm.value || ""
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
          return observableOf([]);
        })
      ).subscribe(data => this.dataSource.data = data);
    // Selection
    this.selection = new SelectionModel<SparePart>(this.isMultiple, [], true)
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
}
