import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ObsoleteItemCenterComponent } from './obsolete-item-center.component';
import { ObsoleteItemMasterComponent } from './obsolete-item-master/obsolete-item-master.component';

const routes: Routes = [{
  path: "",
  component: ObsoleteItemCenterComponent,
  children: [
    {
      path: ":key",
      component: ObsoleteItemMasterComponent,
    },
    {
      path: "",
      component: ObsoleteItemMasterComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObsoleteItemRoutingModule { }
