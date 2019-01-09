import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustMasterComponent } from './adjust-master.component';

describe('AdjustMasterComponent', () => {
  let component: AdjustMasterComponent;
  let fixture: ComponentFixture<AdjustMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjustMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
