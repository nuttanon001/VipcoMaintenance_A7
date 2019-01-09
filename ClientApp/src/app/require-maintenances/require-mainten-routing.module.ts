import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequireMaintenCenterComponent } from './require-mainten-center.component';
import { RequireMaintenMasterComponent } from './require-mainten-master/require-mainten-master.component';
import { RequireMaintenScheduleComponent } from './require-mainten-schedule/require-mainten-schedule.component';

const routes: Routes = [
  {
    path: "",
    component: RequireMaintenCenterComponent,
    children: [
      {
        path: "require-schedule",
        component: RequireMaintenScheduleComponent,
      },
      {
        path: ":key",
        component: RequireMaintenMasterComponent,
      },
      {
        path: "",
        component: RequireMaintenMasterComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequireMaintenRoutingModule { }
