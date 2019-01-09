import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkGroupEditComponent } from './work-group-edit.component';

describe('WorkGroupEditComponent', () => {
  let component: WorkGroupEditComponent;
  let fixture: ComponentFixture<WorkGroupEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkGroupEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkGroupEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
