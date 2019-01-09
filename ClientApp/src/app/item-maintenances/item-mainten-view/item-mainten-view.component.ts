// angular
import { Component, Output, EventEmitter, Input } from "@angular/core";
// models
import { ItemMaintenance } from "../shared/item-maintenance.model";
import { RequireMaintenance } from "../../require-maintenances/shared/require-maintenance.model";
import { ItemMaintenanceHasEmp } from "../shared/item-maintenance-has-emp.model";
import { RequisitionStock } from "../../inventories/shared/requisition-stock.model";
// components
import { BaseViewComponent } from "../../shared/base-view-component";
// services
import { RequireMaintenService } from "../../require-maintenances/shared/require-mainten.service";
import { ItemMaintenHasEmpService } from "../shared/item-mainten-has-emp.service";
import { RequisitionStockService } from "../../inventories/shared/requisition-stock.service";

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
    if (value) {
      if (value.RequireMaintenanceId) {
        this.serviceRequireMainten.getOneKeyNumber({ RequireMaintenanceId: value.RequireMaintenanceId })
          .subscribe(dbData => {
            //debug here
            //console.log(JSON.stringify(dbData));
            if (dbData) {
              this.requireMainten = dbData;
            }
          })
      }

      if (value.ItemMaintenanceId) {
        this.serviceItemMainHasEmp.actionItemMaintenanceHasEmployee(value.ItemMaintenanceId)
          .subscribe(dbData => {
            this.itemMainHasEmployees = dbData.slice();
            //debug here
            //console.log(JSON.stringify(this.itemMainHasEmployees ));
          });

        this.serviceRequistionStock.getRequisitionByItemMaintenance(value.ItemMaintenanceId)
          .subscribe(dbData => {
            this.requisitionStockes = dbData.slice();
            //debug here
            //console.log(JSON.stringify(this.requisitionStockes));
          });
      }
    }
  }
}

