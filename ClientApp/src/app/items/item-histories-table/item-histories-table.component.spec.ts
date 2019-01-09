import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemHistoriesTableComponent } from './item-histories-table.component';

describe('ItemHistoriesTableComponent', () => {
  let component: ItemHistoriesTableComponent;
  let fixture: ComponentFixture<ItemHistoriesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemHistoriesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemHistoriesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
