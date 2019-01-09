import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TypeMaintenCenterComponent } from './type-mainten-center.component';
import { TypeMaintenMasterComponent } from './type-mainten-master/type-mainten-master.component';

const routes: Routes = [
  {
    path: "",
    component: TypeMaintenCenterComponent,
    children: [
      {
        path: ":key",
        component: TypeMaintenMasterComponent,
      },
      {
        path: "",
        component: TypeMaintenMasterComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypeMaintenRoutingModule { }
