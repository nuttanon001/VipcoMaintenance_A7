import { TestBed } from '@angular/core/testing';

import { AllowedEmployeeCommunicateService } from './allowed-employee-communicate.service';

describe('AllowedEmployeeCommunicateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AllowedEmployeeCommunicateService = TestBed.get(AllowedEmployeeCommunicateService);
    expect(service).toBeTruthy();
  });
});
