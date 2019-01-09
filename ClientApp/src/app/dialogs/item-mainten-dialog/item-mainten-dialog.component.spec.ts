import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMaintenDialogComponent } from './item-mainten-dialog.component';

describe('ItemMaintenDialogComponent', () => {
  let component: ItemMaintenDialogComponent;
  let fixture: ComponentFixture<ItemMaintenDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemMaintenDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMaintenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
