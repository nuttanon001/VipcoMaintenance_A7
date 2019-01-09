import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SparePartCenterComponent } from './spare-part-center.component';
import { SparePartMasterComponent } from './spare-part-master/spare-part-master.component';

const routes: Routes = [{
  path: "",
  component: SparePartCenterComponent,
  children: [
    {
      path: ":condition",
      component: SparePartMasterComponent,
    },
    {
      path: "",
      component: SparePartMasterComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SparePartRoutingModule { }
