import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMaintenScheduleComponent } from './item-mainten-schedule.component';

describe('ItemMaintenScheduleComponent', () => {
  let component: ItemMaintenScheduleComponent;
  let fixture: ComponentFixture<ItemMaintenScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemMaintenScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMaintenScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
