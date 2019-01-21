import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMaintenanceListComponent } from './item-maintenance-list.component';

describe('ItemMaintenanceListComponent', () => {
  let component: ItemMaintenanceListComponent;
  let fixture: ComponentFixture<ItemMaintenanceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemMaintenanceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMaintenanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
