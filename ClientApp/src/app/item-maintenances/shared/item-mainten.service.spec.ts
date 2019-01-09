import { TestBed, inject } from '@angular/core/testing';

import { ItemMaintenService } from './item-mainten.service';

describe('ItemMaintenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemMaintenService]
    });
  });

  it('should be created', inject([ItemMaintenService], (service: ItemMaintenService) => {
    expect(service).toBeTruthy();
  }));
});
