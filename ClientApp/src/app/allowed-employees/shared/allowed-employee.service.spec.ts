import { TestBed } from '@angular/core/testing';

import { AllowedEmployeeService } from './allowed-employee.service';

describe('AllowedEmployeeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AllowedEmployeeService = TestBed.get(AllowedEmployeeService);
    expect(service).toBeTruthy();
  });
});
