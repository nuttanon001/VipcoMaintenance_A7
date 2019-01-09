import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMaintenHistoryComponent } from './item-mainten-history.component';

describe('ItemMaintenHistoryComponent', () => {
  let component: ItemMaintenHistoryComponent;
  let fixture: ComponentFixture<ItemMaintenHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemMaintenHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMaintenHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
