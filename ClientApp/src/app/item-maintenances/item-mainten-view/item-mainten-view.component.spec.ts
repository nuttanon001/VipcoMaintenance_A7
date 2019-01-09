import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMaintenViewComponent } from './item-mainten-view.component';

describe('ItemMaintenViewComponent', () => {
  let component: ItemMaintenViewComponent;
  let fixture: ComponentFixture<ItemMaintenViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemMaintenViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMaintenViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
