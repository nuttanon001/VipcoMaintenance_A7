import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkGroupMasterComponent } from './work-group-master.component';

describe('WorkGroupMasterComponent', () => {
  let component: WorkGroupMasterComponent;
  let fixture: ComponentFixture<WorkGroupMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkGroupMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkGroupMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
