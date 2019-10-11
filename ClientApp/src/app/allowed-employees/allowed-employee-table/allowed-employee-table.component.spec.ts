import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllowedEmployeeTableComponent } from './allowed-employee-table.component';

describe('AllowedEmployeeTableComponent', () => {
  let component: AllowedEmployeeTableComponent;
  let fixture: ComponentFixture<AllowedEmployeeTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllowedEmployeeTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllowedEmployeeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
