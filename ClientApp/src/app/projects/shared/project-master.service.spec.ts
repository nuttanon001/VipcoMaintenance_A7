import { TestBed, inject } from '@angular/core/testing';

import { ProjectMasterService } from './project-master.service';

describe('ProjectMasterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectMasterService]
    });
  });

  it('should be created', inject([ProjectMasterService], (service: ProjectMasterService) => {
    expect(service).toBeTruthy();
  }));
});
