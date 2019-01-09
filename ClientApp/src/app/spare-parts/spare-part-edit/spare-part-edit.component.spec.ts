import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SparePartEditComponent } from './spare-part-edit.component';

describe('SparePartEditComponent', () => {
  let component: SparePartEditComponent;
  let fixture: ComponentFixture<SparePartEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SparePartEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SparePartEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
