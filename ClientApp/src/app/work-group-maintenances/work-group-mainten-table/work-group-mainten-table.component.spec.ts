import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkGroupMaintenTableComponent } from './work-group-mainten-table.component';

describe('WorkGroupMaintenTableComponent', () => {
  let component: WorkGroupMaintenTableComponent;
  let fixture: ComponentFixture<WorkGroupMaintenTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkGroupMaintenTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkGroupMaintenTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
