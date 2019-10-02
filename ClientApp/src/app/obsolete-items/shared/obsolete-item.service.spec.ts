import { TestBed } from '@angular/core/testing';

import { ObsoleteItemService } from './obsolete-item.service';

describe('ObsoleteItemService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ObsoleteItemService = TestBed.get(ObsoleteItemService);
    expect(service).toBeTruthy();
  });
});
