import { TestBed, inject } from '@angular/core/testing';

import { RequireMaintenService } from './require-mainten.service';

describe('RequireMaintenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequireMaintenService]
    });
  });

  it('should be created', inject([RequireMaintenService], (service: RequireMaintenService) => {
    expect(service).toBeTruthy();
  }));
});
