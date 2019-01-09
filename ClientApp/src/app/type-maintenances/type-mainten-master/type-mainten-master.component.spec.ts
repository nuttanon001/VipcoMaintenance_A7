import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeMaintenMasterComponent } from './type-mainten-master.component';

describe('TypeMaintenMasterComponent', () => {
  let component: TypeMaintenMasterComponent;
  let fixture: ComponentFixture<TypeMaintenMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeMaintenMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeMaintenMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
