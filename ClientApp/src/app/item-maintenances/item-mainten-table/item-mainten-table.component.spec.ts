import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMaintenTableComponent } from './item-mainten-table.component';

describe('ItemMaintenTableComponent', () => {
  let component: ItemMaintenTableComponent;
  let fixture: ComponentFixture<ItemMaintenTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemMaintenTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMaintenTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
