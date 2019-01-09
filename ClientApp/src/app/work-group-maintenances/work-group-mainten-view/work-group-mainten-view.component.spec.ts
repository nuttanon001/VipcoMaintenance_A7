import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkGroupMaintenViewComponent } from './work-group-mainten-view.component';

describe('WorkGroupMaintenViewComponent', () => {
  let component: WorkGroupMaintenViewComponent;
  let fixture: ComponentFixture<WorkGroupMaintenViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkGroupMaintenViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkGroupMaintenViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
