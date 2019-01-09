import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeMaintenCenterComponent } from './type-mainten-center.component';

describe('TypeMaintenCenterComponent', () => {
  let component: TypeMaintenCenterComponent;
  let fixture: ComponentFixture<TypeMaintenCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeMaintenCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeMaintenCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
