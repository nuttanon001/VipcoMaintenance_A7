import { TestBed, inject } from '@angular/core/testing';

import { MovementStockService } from './movement-stock.service';

describe('MovementStockService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MovementStockService]
    });
  });

  it('should be created', inject([MovementStockService], (service: MovementStockService) => {
    expect(service).toBeTruthy();
  }));
});
