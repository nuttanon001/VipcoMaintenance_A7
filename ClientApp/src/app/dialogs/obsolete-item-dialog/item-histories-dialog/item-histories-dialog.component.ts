import { Component, OnInit } from '@angular/core';
import { ItemHistories } from 'src/app/items/shared/item-histories.model';
import { BaseTableDetailComponent } from 'src/app/shared2/baseclases/base-table-detail.component';
import * as moment from "moment";

@Component({
  selector: 'app-item-histories-dialog',
  templateUrl: './item-histories-dialog.component.html',
  styleUrls: ['./item-histories-dialog.component.scss']
})
export class ItemHistoriesDialogComponent
  extends BaseTableDetailComponent<ItemHistories>{

  constructor() {
    super();
    this.columns = [
      // { columnName: "Line", columnField: "Line", cell: (row: ReceiptLine) => row.Line },
      {
        columnName: "Date", columnField: "Date", cell: (row: ItemHistories) => moment(row.Date).format("DD-MM-YYYY"),
        canEdit: false
      },
      {
        columnName: "Fail", columnField: "Fail", cell: (row: ItemHistories) => row.Fail,
        canEdit: false
      },
      {
        columnName: "Fix", columnField: "Fix", cell: (row: ItemHistories) => row.Fix,
        canEdit: false
      },
      {
        columnName: "Remark", columnField: "Remark", cell: (row: ItemHistories) => row.Remark,
        canEdit: false
      },
    ];
    this.displayedColumns = this.columns.map(x => x.columnField);
    // this.displayedColumns.splice(0, 0, "Command");
  }

  // on blur
  onBlurText(rowData?: ItemHistories): void {
    if (rowData) {
      this.returnSelectedWith.emit({
        data: rowData,
        option: 2
      });
    }
  }
}
