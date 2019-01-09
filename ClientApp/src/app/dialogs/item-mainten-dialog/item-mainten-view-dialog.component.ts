import { Component } from '@angular/core';
//Components
import { ItemMaintenViewComponent } from '../../item-maintenances/item-mainten-view/item-mainten-view.component';
//Services
import { RequireMaintenService } from '../../require-maintenances/shared/require-mainten.service';
import { ItemMaintenHasEmpService } from '../../item-maintenances/shared/item-mainten-has-emp.service';
import { RequisitionStockService } from '../../inventories/shared/requisition-stock.service';

@Component({
  selector: 'app-item-mainten-view-dialog',
  templateUrl: '../../item-maintenances/item-mainten-view/item-mainten-view.component.html',
  styleUrls: ['../../item-maintenances/item-mainten-view/item-mainten-view.component.scss']
})
export class ItemMaintenViewDialogComponent extends ItemMaintenViewComponent {

  constructor(
    requireService: RequireMaintenService,
    itemMainHasEmpService: ItemMaintenHasEmpService,
    requisitionService:RequisitionStockService,
  ) {
    super(
      requireService,
      itemMainHasEmpService,
      requisitionService
    );
  }

}
