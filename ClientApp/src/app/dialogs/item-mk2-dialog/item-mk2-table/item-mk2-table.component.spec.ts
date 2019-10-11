import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMk2TableComponent } from './item-mk2-table.component';

describe('ItemMk2TableComponent', () => {
  let component: ItemMk2TableComponent;
  let fixture: ComponentFixture<ItemMk2TableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemMk2TableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMk2TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
