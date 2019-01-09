import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkGroupMaintenEditComponent } from './work-group-mainten-edit.component';

describe('WorkGroupMaintenEditComponent', () => {
  let component: WorkGroupMaintenEditComponent;
  let fixture: ComponentFixture<WorkGroupMaintenEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkGroupMaintenEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkGroupMaintenEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
