import { TestBed, inject } from '@angular/core/testing';

import { WorkGroupMaintenService } from './work-group-mainten.service';

describe('WorkGroupMaintenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkGroupMaintenService]
    });
  });

  it('should be created', inject([WorkGroupMaintenService], (service: WorkGroupMaintenService) => {
    expect(service).toBeTruthy();
  }));
});
