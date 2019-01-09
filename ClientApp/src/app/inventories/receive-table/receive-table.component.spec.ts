import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveTableComponent } from './receive-table.component';

describe('ReceiveTableComponent', () => {
  let component: ReceiveTableComponent;
  let fixture: ComponentFixture<ReceiveTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiveTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
