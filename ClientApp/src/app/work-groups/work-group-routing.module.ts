import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Component
import { WorkGroupCenterComponent } from "./work-group-center.component";
import { WorkGroupMasterComponent } from "./work-group-master/work-group-master.component";

const routes: Routes = [
  {
    path: "",
    component: WorkGroupCenterComponent,
    children: [
      {
        path: ":key",
        component: WorkGroupMasterComponent,
      },
      {
        path: "",
        component: WorkGroupMasterComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkGroupRoutingModule { }
