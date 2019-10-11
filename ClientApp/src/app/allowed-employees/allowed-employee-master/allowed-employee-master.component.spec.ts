import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllowedEmployeeMasterComponent } from './allowed-employee-master.component';

describe('AllowedEmployeeMasterComponent', () => {
  let component: AllowedEmployeeMasterComponent;
  let fixture: ComponentFixture<AllowedEmployeeMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllowedEmployeeMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllowedEmployeeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
