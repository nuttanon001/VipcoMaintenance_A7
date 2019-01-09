import { TestBed, inject } from '@angular/core/testing';

import { ProjectSubService } from './project-sub.service';

describe('ProjectSubService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectSubService]
    });
  });

  it('should be created', inject([ProjectSubService], (service: ProjectSubService) => {
    expect(service).toBeTruthy();
  }));
});
