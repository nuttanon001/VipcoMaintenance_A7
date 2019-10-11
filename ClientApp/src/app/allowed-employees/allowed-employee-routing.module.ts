import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllowedEmployeeCenterComponent } from './allowed-employee-center.component';
import { AllowedEmployeeMasterComponent } from './allowed-employee-master/allowed-employee-master.component';

const routes: Routes = [{
  path: "",
  component: AllowedEmployeeCenterComponent,
  children: [
    {
      path: ":key",
      component: AllowedEmployeeMasterComponent,
    },
    {
      path: "",
      component: AllowedEmployeeMasterComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllowedEmployeeRoutingModule { }
