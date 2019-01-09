import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequireMaintenViewComponent } from './require-mainten-view.component';

describe('RequireMaintenViewComponent', () => {
  let component: RequireMaintenViewComponent;
  let fixture: ComponentFixture<RequireMaintenViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequireMaintenViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequireMaintenViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
