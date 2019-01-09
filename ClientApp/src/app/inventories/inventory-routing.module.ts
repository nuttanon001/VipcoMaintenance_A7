import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryCenterComponent } from './inventory-center.component';
import { ReceiveMasterComponent } from './receive-master/receive-master.component';
import { AdjustMasterComponent } from './adjust-master/adjust-master.component';

const routes: Routes = [{
  path: "",
  component: InventoryCenterComponent,
  children: [
    {
      path: "receive:key",
      component: ReceiveMasterComponent,
    },
    {
      path: "receive",
      component: ReceiveMasterComponent,
    },
    {
      path: "adjust:key",
      component: AdjustMasterComponent,
    },
    {
      path: "adjust",
      component: AdjustMasterComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoriyRoutingModule { }
