import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequireMaintenEditComponent } from './require-mainten-edit.component';

describe('RequireMaintenEditComponent', () => {
  let component: RequireMaintenEditComponent;
  let fixture: ComponentFixture<RequireMaintenEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequireMaintenEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequireMaintenEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
