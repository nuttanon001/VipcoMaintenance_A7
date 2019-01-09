import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustTableComponent } from './adjust-table.component';

describe('AdjustTableComponent', () => {
  let component: AdjustTableComponent;
  let fixture: ComponentFixture<AdjustTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjustTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
