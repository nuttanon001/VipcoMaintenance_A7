import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMasterListComponent } from './item-master-list.component';

describe('ItemMasterListComponent', () => {
  let component: ItemMasterListComponent;
  let fixture: ComponentFixture<ItemMasterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemMasterListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
