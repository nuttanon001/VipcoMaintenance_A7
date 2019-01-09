import { TestBed, inject } from '@angular/core/testing';

import { EmployeeGroupMisService } from './employee-group-mis.service';

describe('EmployeeGroupMisService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeeGroupMisService]
    });
  });

  it('should be created', inject([EmployeeGroupMisService], (service: EmployeeGroupMisService) => {
    expect(service).toBeTruthy();
  }));
});
