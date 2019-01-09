import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { ItemMaintenService } from "../shared/item-mainten.service";

@Component({
  selector: 'app-item-mainten-report',
  templateUrl: './item-mainten-report.component.html',
  styleUrls: ['./item-mainten-report.component.scss']
})
export class ItemMaintenReportComponent implements OnInit {

  /** paint-task-detail-paint-report ctor */
  constructor(
    private service: ItemMaintenService
  ) { }
  // Parameter
  @Input() ItemMaintenanceId: number;
  @Output() Back = new EventEmitter<boolean>();
  ReportData: any;
  // called by Angular after aint-task-detail-paint-report component initialized */
  ngOnInit(): void {
    if (this.ItemMaintenanceId) {
      this.service.getItemMaintenanceReport(this.ItemMaintenanceId)
        .subscribe(dbReport => {
          this.ReportData = dbReport;
        });
    } else {
      this.onBackToMaster();
    }
  }

  // on Print OverTimeMaster
  onPrintOverTimeMaster(): void {
    window.print();
  }

  // on Back
  onBackToMaster(): void {
    this.Back.emit(true);
  }
}
