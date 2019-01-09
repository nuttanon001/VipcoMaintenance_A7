import { TestBed, inject } from '@angular/core/testing';

import { ItemMaintenHasEmpService } from './item-mainten-has-emp.service';

describe('ItemMaintenHasEmpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemMaintenHasEmpService]
    });
  });

  it('should be created', inject([ItemMaintenHasEmpService], (service: ItemMaintenHasEmpService) => {
    expect(service).toBeTruthy();
  }));
});
