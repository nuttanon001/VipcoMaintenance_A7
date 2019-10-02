import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObsoleteItemScheduleComponent } from './obsolete-item-schedule.component';

describe('ObsoleteItemScheduleComponent', () => {
  let component: ObsoleteItemScheduleComponent;
  let fixture: ComponentFixture<ObsoleteItemScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObsoleteItemScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObsoleteItemScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
