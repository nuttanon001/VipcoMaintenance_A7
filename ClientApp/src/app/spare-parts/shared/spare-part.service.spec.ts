import { TestBed, inject } from '@angular/core/testing';

import { SparePartService } from './spare-part.service';

describe('SparePartService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SparePartService]
    });
  });

  it('should be created', inject([SparePartService], (service: SparePartService) => {
    expect(service).toBeTruthy();
  }));
});
