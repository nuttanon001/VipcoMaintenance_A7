import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BranchCenterComponent } from "./branch-center.component";
import { BranchMasterComponent } from "./branch-master/branch-master.component";

const routes: Routes = [
  {
    path: "",
    component: BranchCenterComponent,
    children: [
      {
        path: ":key",
        component: BranchMasterComponent,
      },
      {
        path: "",
        component: BranchMasterComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchRoutingModule { }
