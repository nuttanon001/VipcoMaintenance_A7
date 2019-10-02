// Angular Core
import { FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewContainerRef, Output, EventEmitter, Input } from '@angular/core';
// Components
import { BaseScheduleComponent } from 'src/app/shared2/baseclases/base-schedule.component';
// Models
import { ObsoleteItem } from '../shared/obsolete-item.model';
import { Scroll } from 'src/app/shared2/basemode/scroll.model';
import { Format } from 'src/app/shared2/basemode/my-colmun.model';
import { ScrollData } from 'src/app/shared2/basemode/scroll-data.model';
// Services
import { ObsoleteItemService } from '../shared/obsolete-item.service';
import { DialogsService } from 'src/app/dialogs/shared/dialogs.service';

@Component({
  selector: 'app-obsolete-item-schedule',
  templateUrl: './obsolete-item-schedule.component.html',
  styleUrls: ['./obsolete-item-schedule.component.scss']
})
export class ObsoleteItemScheduleComponent
  extends BaseScheduleComponent<ObsoleteItem, ObsoleteItemService> {
  constructor(service: ObsoleteItemService,
    fb: FormBuilder,
    viewRef: ViewContainerRef,
    serviceDialog: DialogsService) { super(service, fb, viewRef, serviceDialog); }

  @Input() OptionFilter: Scroll;
  @Output() returnSelectedWith: EventEmitter<{ data: ObsoleteItem, option: number }> = new EventEmitter<{ data: ObsoleteItem, option: number }>();
  @Output() filter: EventEmitter<Scroll> = new EventEmitter<Scroll>();

  ngOnInit(): void {
    if (this.OptionFilter) {
      this.scroll = this.OptionFilter;
    }

    super.ngOnInit();
  }

  /**
   * Getdata from web api
   * @param schedule
   */
  onGetData(schedule: Scroll): void {
    // Emit scroll to MasterComponent
    this.filter.emit(schedule);

    this.service.getSchedule(schedule)
      .subscribe((dbData: ScrollData<any>) => {
        if (!dbData && !dbData.Data) {
          this.totalRecords = 0;
          this.columns = new Array;
          this.datasource = new Array;
          this.loading = false;
          return;
        }

        if (dbData.Scroll) {
          this.totalRecords = dbData.Scroll.TotalRow || 0;
        } else {
          this.totalRecords = 0;
        }

        // new Column Array
        this.columns = new Array;
        this.columns = [
          { header: "Date", field: "CancelDate", width: 250, format: Format.Date },
          { header: "Infomation", field: "ItemCancels", width: 550 },
        ];

        if (dbData.Data) {
          this.datasource = dbData.Data.slice();
        } else {
          this.datasource = new Array;
        }

        if (this.needReset) {
          this.first = 0;
          this.needReset = false;
        }
      }, error => {
        this.totalRecords = 0;
        this.columns = new Array;
        this.datasource = new Array;
      }, () => this.loading = false);
  }

  onShowDialog(type?: string): void {
    throw new Error("Method not implemented.");
  }

  /**
   * Return item have click to master
   * @param subItem
   */
  onClickSubItem(subItem?: any): void {
    if (subItem) {
      this.returnSelectedWith
        .emit({
          data: {
            ObsoleteItemId: subItem.ObsoleteItemId,
            ItemId: subItem.ItemId,
            ItemCode: subItem.ItemCode,
            ItemName: subItem.ItemName
          },
          option: 1
        });
    }
  }
}
