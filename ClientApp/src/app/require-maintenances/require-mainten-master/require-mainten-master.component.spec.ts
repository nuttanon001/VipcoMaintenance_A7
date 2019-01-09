import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequireMaintenMasterComponent } from './require-mainten-master.component';

describe('RequireMaintenMasterComponent', () => {
  let component: RequireMaintenMasterComponent;
  let fixture: ComponentFixture<RequireMaintenMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequireMaintenMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequireMaintenMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
