import { TestBed, inject } from '@angular/core/testing';

import { RequisitionStockService } from './requisition-stock.service';

describe('RequisitionStockService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequisitionStockService]
    });
  });

  it('should be created', inject([RequisitionStockService], (service: RequisitionStockService) => {
    expect(service).toBeTruthy();
  }));
});
