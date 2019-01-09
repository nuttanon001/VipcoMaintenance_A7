import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequireMaintenTableComponent } from './require-mainten-table.component';

describe('RequireMaintenTableComponent', () => {
  let component: RequireMaintenTableComponent;
  let fixture: ComponentFixture<RequireMaintenTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequireMaintenTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequireMaintenTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
