import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SparePartTableDialogComponent } from './spare-part-table-dialog.component';

describe('SparePartTableDialogComponent', () => {
  let component: SparePartTableDialogComponent;
  let fixture: ComponentFixture<SparePartTableDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SparePartTableDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SparePartTableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
