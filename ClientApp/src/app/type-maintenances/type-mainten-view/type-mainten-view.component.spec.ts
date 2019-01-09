import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeMaintenViewComponent } from './type-mainten-view.component';

describe('TypeMaintenViewComponent', () => {
  let component: TypeMaintenViewComponent;
  let fixture: ComponentFixture<TypeMaintenViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeMaintenViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeMaintenViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
