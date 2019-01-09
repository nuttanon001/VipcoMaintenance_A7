import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustViewComponent } from './adjust-view.component';

describe('AdjustViewComponent', () => {
  let component: AdjustViewComponent;
  let fixture: ComponentFixture<AdjustViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjustViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
