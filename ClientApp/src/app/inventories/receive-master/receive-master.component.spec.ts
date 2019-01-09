import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveMasterComponent } from './receive-master.component';

describe('ReceiveMasterComponent', () => {
  let component: ReceiveMasterComponent;
  let fixture: ComponentFixture<ReceiveMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiveMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
