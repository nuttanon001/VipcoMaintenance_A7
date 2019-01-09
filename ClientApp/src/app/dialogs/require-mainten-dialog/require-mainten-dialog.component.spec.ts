import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequireMaintenDialogComponent } from './require-mainten-dialog.component';

describe('RequireMaintenDialogComponent', () => {
  let component: RequireMaintenDialogComponent;
  let fixture: ComponentFixture<RequireMaintenDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequireMaintenDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequireMaintenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
