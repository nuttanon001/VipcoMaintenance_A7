import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTypeMasterComponent } from './item-type-master.component';

describe('ItemTypeMasterComponent', () => {
  let component: ItemTypeMasterComponent;
  let fixture: ComponentFixture<ItemTypeMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemTypeMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
