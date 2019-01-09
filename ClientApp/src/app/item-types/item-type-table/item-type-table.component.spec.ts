import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTypeTableComponent } from './item-type-table.component';

describe('ItemTypeTableComponent', () => {
  let component: ItemTypeTableComponent;
  let fixture: ComponentFixture<ItemTypeTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemTypeTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemTypeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
