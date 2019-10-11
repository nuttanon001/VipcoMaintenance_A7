import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// Component
import { AllowedEmployeeCenterComponent } from './allowed-employee-center.component';
import { AllowedEmployeeInfoComponent } from './allowed-employee-info/allowed-employee-info.component';
import { AllowedEmployeeTableComponent } from './allowed-employee-table/allowed-employee-table.component';
import { AllowedEmployeeMasterComponent } from './allowed-employee-master/allowed-employee-master.component';
// Services
import { AllowedEmployeeCommunicateService } from './shared/allowed-employee-communicate.service';
// Modules
import { SharedModule } from '../shared2/shared.module';
import { CustomMaterialModule } from '../shared2/customer-material.module';
import { AllowedEmployeeRoutingModule } from './allowed-employee-routing.module';
import { EmployeeService } from '../employees/shared/employee.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    AllowedEmployeeRoutingModule
  ],
  declarations: [
    AllowedEmployeeInfoComponent,
    AllowedEmployeeTableComponent,
    AllowedEmployeeCenterComponent,
    AllowedEmployeeMasterComponent,
  ],
  providers: [
    EmployeeService,
    AllowedEmployeeCommunicateService
  ]
})
export class AllowedEmployeeModule { }
