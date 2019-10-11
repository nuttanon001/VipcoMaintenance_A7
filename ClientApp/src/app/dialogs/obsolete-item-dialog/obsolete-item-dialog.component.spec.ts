import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObsoleteItemDialogComponent } from './obsolete-item-dialog.component';

describe('ObsoleteItemDialogComponent', () => {
  let component: ObsoleteItemDialogComponent;
  let fixture: ComponentFixture<ObsoleteItemDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObsoleteItemDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObsoleteItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
