import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMaintenRequisitionTableComponent } from './item-mainten-requisition-table.component';

describe('ItemMaintenRequisitionTableComponent', () => {
  let component: ItemMaintenRequisitionTableComponent;
  let fixture: ComponentFixture<ItemMaintenRequisitionTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemMaintenRequisitionTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMaintenRequisitionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
