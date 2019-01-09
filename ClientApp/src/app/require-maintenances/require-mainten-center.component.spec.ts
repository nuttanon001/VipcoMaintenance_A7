import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequireMaintenCenterComponent } from './require-mainten-center.component';

describe('RequireMaintenCenterComponent', () => {
  let component: RequireMaintenCenterComponent;
  let fixture: ComponentFixture<RequireMaintenCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequireMaintenCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequireMaintenCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
