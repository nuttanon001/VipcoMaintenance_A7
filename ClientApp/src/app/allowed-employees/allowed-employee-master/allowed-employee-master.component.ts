import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
// Components
import { BaseMasterComponent } from 'src/app/shared2/baseclases/base-master-component';
import { AllowedEmployeeTableComponent } from '../allowed-employee-table/allowed-employee-table.component';
// Models
import { AllowedEmployee } from '../shared/allowed-employee.model';
// Services
import { AuthService } from 'src/app/core/auth/auth.service';
import { DialogsService } from 'src/app/dialogs/shared/dialogs.service';
import { AllowedEmployeeService } from '../shared/allowed-employee.service';
import { AllowedEmployeeCommunicateService } from '../shared/allowed-employee-communicate.service';

@Component({
  selector: 'app-allowed-employee-master',
  templateUrl: './allowed-employee-master.component.html',
  styleUrls: ['./allowed-employee-master.component.scss']
})
export class AllowedEmployeeMasterComponent
  extends BaseMasterComponent<AllowedEmployee, AllowedEmployeeService, AllowedEmployeeCommunicateService> {

  constructor(
    service: AllowedEmployeeService,
    serviceCom: AllowedEmployeeCommunicateService,
    serviceAuth: AuthService,
    serviceDialog: DialogsService,
    viewCon: ViewContainerRef,
  ) {
    super(service, serviceCom, serviceAuth, serviceDialog, viewCon);
  }

  backToSchedule: boolean = false;
  @ViewChild(AllowedEmployeeTableComponent)
  private tableComponent: AllowedEmployeeTableComponent;

  onReloadData(): void {
    this.tableComponent.reloadData();
  }

}
