import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemHistoriesDialogComponent } from './item-histories-dialog.component';

describe('ItemHistoriesDialogComponent', () => {
  let component: ItemHistoriesDialogComponent;
  let fixture: ComponentFixture<ItemHistoriesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemHistoriesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemHistoriesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
