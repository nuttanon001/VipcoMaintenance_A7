import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitionTableComponent } from './requisition-table.component';

describe('RequisitionTableComponent', () => {
  let component: RequisitionTableComponent;
  let fixture: ComponentFixture<RequisitionTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequisitionTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
