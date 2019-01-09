import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMaintenCenterComponent } from './item-mainten-center.component';

describe('ItemMaintenCenterComponent', () => {
  let component: ItemMaintenCenterComponent;
  let fixture: ComponentFixture<ItemMaintenCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemMaintenCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMaintenCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
