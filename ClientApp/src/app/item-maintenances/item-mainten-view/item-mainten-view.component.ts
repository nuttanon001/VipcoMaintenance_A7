// angular
import { Component, Output, EventEmitter, Input } from '@angular/core';
// models
import { ItemMaintenance } from '../shared/item-maintenance.model';
import { RequireMaintenance } from '../../require-maintenances/shared/require-maintenance.model';
import { ItemMaintenanceHasEmp } from '../shared/item-maintenance-has-emp.model';
import { RequisitionStock } from '../../inventories/shared/requisition-stock.model';
// components
import { BaseViewComponent } from '../../shared/base-view-component';
// services
import { RequireMaintenService } from '../../require-maintenances/shared/require-mainten.service';
import { ItemMaintenHasEmpService } from '../shared/item-mainten-has-emp.service';
import { RequisitionStockService } from '../../inventories/shared/requisition-stock.service';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-item-mainten-view',
  templateUrl: './item-mainten-view.component.html',
  styleUrls: ['./item-mainten-view.component.scss']
})
export class ItemMaintenViewComponent extends BaseViewComponent<ItemMaintenance> {
  constructor(
    private serviceRequireMainten: RequireMaintenService,
    private serviceItemMainHasEmp: ItemMaintenHasEmpService,
    private serviceRequistionStock: RequisitionStockService,
  ) {
    super();
  }
  // Parameter
  requireMainten: RequireMaintenance;
  itemMainHasEmployees: Array<ItemMaintenanceHasEmp>;
  requisitionStockes: Array<RequisitionStock>;
  // load more data
  onLoadMoreData(value: ItemMaintenance) {
    if (value && value.ItemMaintenanceId) {
      this.serviceRequireMainten.getOneKeyNumber({RequireMaintenanceId: value.RequireMaintenanceId})
        .pipe(switchMap((dbRequire?: RequireMaintenance) => {
          if (dbRequire) {
            this.requireMainten = dbRequire;
          }
          // Get ItemMaintenance Employee
          return this.serviceItemMainHasEmp.actionItemMaintenanceHasEmployee(value.ItemMaintenanceId);
        }), switchMap((dbEmp : ItemMaintenanceHasEmp[]) => {
          if (dbEmp) {
            this.itemMainHasEmployees = dbEmp.slice();
          }
          // Stock
          return  this.serviceRequistionStock.getRequisitionByItemMaintenance(value.ItemMaintenanceId);
        }), map((dbStock: RequisitionStock[]) => {
          if (dbStock) {
            this.requisitionStockes = dbStock.slice();
          }
        })).subscribe();
    }
  }
}

