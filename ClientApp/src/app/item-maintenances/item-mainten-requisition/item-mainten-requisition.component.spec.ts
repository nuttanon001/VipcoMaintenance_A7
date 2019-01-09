import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMaintenRequisitionComponent } from './item-mainten-requisition.component';

describe('ItemMaintenRequisitionComponent', () => {
  let component: ItemMaintenRequisitionComponent;
  let fixture: ComponentFixture<ItemMaintenRequisitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemMaintenRequisitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMaintenRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
