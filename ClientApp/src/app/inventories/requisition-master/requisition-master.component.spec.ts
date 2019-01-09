import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitionMasterComponent } from './requisition-master.component';

describe('RequisitionMasterComponent', () => {
  let component: RequisitionMasterComponent;
  let fixture: ComponentFixture<RequisitionMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequisitionMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
