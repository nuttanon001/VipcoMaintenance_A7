import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObsoleteItemInfoDialogComponent } from './obsolete-item-info-dialog.component';

describe('ObsoleteItemInfoDialogComponent', () => {
  let component: ObsoleteItemInfoDialogComponent;
  let fixture: ComponentFixture<ObsoleteItemInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObsoleteItemInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObsoleteItemInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
