// Angular Core
import { Component, Input } from "@angular/core";
// Components
import { BaseTableFontData } from "../../shared/base-table-fontdata.component";
// Module
import { ItemHistories } from "../shared/item-histories.model";

@Component({
  selector: 'app-item-histories-table',
  templateUrl: './item-histories-table.component.html',
  styleUrls: ['./item-histories-table.component.scss']
})

export class ItemHistoriesTableComponent extends BaseTableFontData<ItemHistories> {
  /** custom-mat-table ctor */
  constructor() {
    super();
    this.displayedColumns = ["select", "Date", "Fail", "Fix", "edit"]
  }
  @Input() isLoaded: boolean;
  // Angular on changes
  ngOnChanges() {
    this.isLoadingResults = this.isLoaded;
    super.ngOnChanges();
  }
}
