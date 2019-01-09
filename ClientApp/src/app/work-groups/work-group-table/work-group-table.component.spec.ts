import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkGroupTableComponent } from './work-group-table.component';

describe('WorkGroupTableComponent', () => {
  let component: WorkGroupTableComponent;
  let fixture: ComponentFixture<WorkGroupTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkGroupTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkGroupTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
