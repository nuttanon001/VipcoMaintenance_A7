import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkGroupMaintenMasterComponent } from './work-group-mainten-master.component';

describe('WorkGroupMaintenMasterComponent', () => {
  let component: WorkGroupMaintenMasterComponent;
  let fixture: ComponentFixture<WorkGroupMaintenMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkGroupMaintenMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkGroupMaintenMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
