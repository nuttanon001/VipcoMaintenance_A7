import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequireMaintenViewDialogComponent } from './require-mainten-view-dialog.component';

describe('RequireMaintenViewDialogComponent', () => {
  let component: RequireMaintenViewDialogComponent;
  let fixture: ComponentFixture<RequireMaintenViewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequireMaintenViewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequireMaintenViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
