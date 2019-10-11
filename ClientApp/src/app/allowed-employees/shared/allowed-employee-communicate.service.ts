import { Injectable } from '@angular/core';
import { BaseCommunicateService } from 'src/app/shared2/baseclases/base-communicate.service';
import { AllowedEmployee } from './allowed-employee.model';

@Injectable()
export class AllowedEmployeeCommunicateService
  extends BaseCommunicateService<AllowedEmployee> {

  constructor() { super(); }
}
