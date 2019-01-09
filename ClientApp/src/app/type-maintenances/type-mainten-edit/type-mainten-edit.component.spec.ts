import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeMaintenEditComponent } from './type-mainten-edit.component';

describe('TypeMaintenEditComponent', () => {
  let component: TypeMaintenEditComponent;
  let fixture: ComponentFixture<TypeMaintenEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeMaintenEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeMaintenEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
