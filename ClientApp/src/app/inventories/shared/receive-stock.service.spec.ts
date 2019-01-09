import { TestBed, inject } from '@angular/core/testing';

import { ReceiveStockService } from './receive-stock.service';

describe('ReceiveStockService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReceiveStockService]
    });
  });

  it('should be created', inject([ReceiveStockService], (service: ReceiveStockService) => {
    expect(service).toBeTruthy();
  }));
});
