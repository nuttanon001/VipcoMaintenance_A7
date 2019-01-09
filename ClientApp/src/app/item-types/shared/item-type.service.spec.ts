import { TestBed, inject } from '@angular/core/testing';

import { ItemTypeService } from './item-type.service';

describe('ItemTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemTypeService]
    });
  });

  it('should be created', inject([ItemTypeService], (service: ItemTypeService) => {
    expect(service).toBeTruthy();
  }));
});
