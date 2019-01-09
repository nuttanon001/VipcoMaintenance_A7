import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkGroupCenterComponent } from './work-group-center.component';

describe('WorkGroupCenterComponent', () => {
  let component: WorkGroupCenterComponent;
  let fixture: ComponentFixture<WorkGroupCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkGroupCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkGroupCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
