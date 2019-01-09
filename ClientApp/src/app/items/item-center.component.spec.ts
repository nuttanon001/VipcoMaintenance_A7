import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCenterComponent } from './item-center.component';

describe('ItemCenterComponent', () => {
  let component: ItemCenterComponent;
  let fixture: ComponentFixture<ItemCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
