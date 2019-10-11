import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllowedEmployeeCenterComponent } from './allowed-employee-center.component';

describe('AllowedEmployeeCenterComponent', () => {
  let component: AllowedEmployeeCenterComponent;
  let fixture: ComponentFixture<AllowedEmployeeCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllowedEmployeeCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllowedEmployeeCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
