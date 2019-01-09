import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveEditComponent } from './receive-edit.component';

describe('ReceiveEditComponent', () => {
  let component: ReceiveEditComponent;
  let fixture: ComponentFixture<ReceiveEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiveEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
