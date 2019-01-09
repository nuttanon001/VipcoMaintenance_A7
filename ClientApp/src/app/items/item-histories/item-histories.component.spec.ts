import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemHistoriesComponent } from './item-histories.component';

describe('ItemHistoriesComponent', () => {
  let component: ItemHistoriesComponent;
  let fixture: ComponentFixture<ItemHistoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemHistoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemHistoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
