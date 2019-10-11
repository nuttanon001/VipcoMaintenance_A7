import { TestBed } from '@angular/core/testing';

import { ItemMk2Service } from './item-mk2.service';

describe('ItemMk2Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ItemMk2Service = TestBed.get(ItemMk2Service);
    expect(service).toBeTruthy();
  });
});
