import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMaintenViewDialogComponent } from './item-mainten-view-dialog.component';

describe('ItemMaintenViewDialogComponent', () => {
  let component: ItemMaintenViewDialogComponent;
  let fixture: ComponentFixture<ItemMaintenViewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemMaintenViewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMaintenViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
