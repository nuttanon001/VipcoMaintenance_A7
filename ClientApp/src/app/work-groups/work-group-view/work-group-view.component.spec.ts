import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkGroupViewComponent } from './work-group-view.component';

describe('WorkGroupViewComponent', () => {
  let component: WorkGroupViewComponent;
  let fixture: ComponentFixture<WorkGroupViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkGroupViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkGroupViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
