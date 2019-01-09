import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTypeCenterComponent } from './item-type-center.component';

describe('ItemTypeCenterComponent', () => {
  let component: ItemTypeCenterComponent;
  let fixture: ComponentFixture<ItemTypeCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemTypeCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemTypeCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
