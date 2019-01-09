import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustEditComponent } from './adjust-edit.component';

describe('AdjustEditComponent', () => {
  let component: AdjustEditComponent;
  let fixture: ComponentFixture<AdjustEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjustEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
