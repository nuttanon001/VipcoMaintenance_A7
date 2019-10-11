import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllowedEmployeeInfoComponent } from './allowed-employee-info.component';

describe('AllowedEmployeeInfoComponent', () => {
  let component: AllowedEmployeeInfoComponent;
  let fixture: ComponentFixture<AllowedEmployeeInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllowedEmployeeInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllowedEmployeeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
