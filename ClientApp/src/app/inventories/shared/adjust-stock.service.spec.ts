import { TestBed, inject } from '@angular/core/testing';

import { AdjustStockService } from './adjust-stock.service';

describe('AdjustStockService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdjustStockService]
    });
  });

  it('should be created', inject([AdjustStockService], (service: AdjustStockService) => {
    expect(service).toBeTruthy();
  }));
});
