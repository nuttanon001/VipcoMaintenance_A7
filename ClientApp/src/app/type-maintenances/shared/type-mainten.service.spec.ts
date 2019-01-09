import { TestBed, inject } from '@angular/core/testing';

import { TypeMaintenService } from './type-mainten.service';

describe('TypeMaintenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TypeMaintenService]
    });
  });

  it('should be created', inject([TypeMaintenService], (service: TypeMaintenService) => {
    expect(service).toBeTruthy();
  }));
});
