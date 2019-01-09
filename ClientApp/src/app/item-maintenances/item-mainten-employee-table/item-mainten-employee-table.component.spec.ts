import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMaintenEmployeeTableComponent } from './item-mainten-employee-table.component';

describe('ItemMaintenEmployeeTableComponent', () => {
  let component: ItemMaintenEmployeeTableComponent;
  let fixture: ComponentFixture<ItemMaintenEmployeeTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemMaintenEmployeeTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMaintenEmployeeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
