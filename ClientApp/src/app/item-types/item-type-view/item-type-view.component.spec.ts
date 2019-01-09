import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTypeViewComponent } from './item-type-view.component';

describe('ItemTypeViewComponent', () => {
  let component: ItemTypeViewComponent;
  let fixture: ComponentFixture<ItemTypeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemTypeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemTypeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
