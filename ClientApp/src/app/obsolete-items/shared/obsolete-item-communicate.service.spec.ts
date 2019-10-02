import { TestBed } from '@angular/core/testing';

import { ObsoleteItemCommunicateService } from './obsolete-item-communicate.service';

describe('ObsoleteItemCommunicateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ObsoleteItemCommunicateService = TestBed.get(ObsoleteItemCommunicateService);
    expect(service).toBeTruthy();
  });
});
