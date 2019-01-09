import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequireMaintenScheduleComponent } from './require-mainten-schedule.component';

describe('RequireMaintenScheduleComponent', () => {
  let component: RequireMaintenScheduleComponent;
  let fixture: ComponentFixture<RequireMaintenScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequireMaintenScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequireMaintenScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
