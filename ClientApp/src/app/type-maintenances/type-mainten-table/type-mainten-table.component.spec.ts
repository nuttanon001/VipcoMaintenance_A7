import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeMaintenTableComponent } from './type-mainten-table.component';

describe('TypeMaintenTableComponent', () => {
  let component: TypeMaintenTableComponent;
  let fixture: ComponentFixture<TypeMaintenTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeMaintenTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeMaintenTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
