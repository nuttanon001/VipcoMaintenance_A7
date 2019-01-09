import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SparePartDialogComponent } from './spare-part-dialog.component';

describe('SparePartDialogComponent', () => {
  let component: SparePartDialogComponent;
  let fixture: ComponentFixture<SparePartDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SparePartDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SparePartDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
