import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkGroupMaintenCenterComponent } from './work-group-mainten-center.component';
import { WorkGroupMaintenMasterComponent } from './work-group-mainten-master/work-group-mainten-master.component';

const routes: Routes = [
  {
    path: "",
    component: WorkGroupMaintenCenterComponent,
    children: [
      {
        path: ":key",
        component: WorkGroupMaintenMasterComponent,
      },
      {
        path: "",
        component: WorkGroupMaintenMasterComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkGroupMaintenRoutingModule { }
