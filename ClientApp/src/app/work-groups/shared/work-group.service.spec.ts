import { TestBed, inject } from '@angular/core/testing';

import { WorkGroupService } from './work-group.service';

describe('WorkGroupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkGroupService]
    });
  });

  it('should be created', inject([WorkGroupService], (service: WorkGroupService) => {
    expect(service).toBeTruthy();
  }));
});
