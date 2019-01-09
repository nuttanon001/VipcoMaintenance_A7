import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkGroupMaintenCenterComponent } from './work-group-mainten-center.component';

describe('WorkGroupMaintenCenterComponent', () => {
  let component: WorkGroupMaintenCenterComponent;
  let fixture: ComponentFixture<WorkGroupMaintenCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkGroupMaintenCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkGroupMaintenCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
