import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitionEditComponent } from './requisition-edit.component';

describe('RequisitionEditComponent', () => {
  let component: RequisitionEditComponent;
  let fixture: ComponentFixture<RequisitionEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequisitionEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
