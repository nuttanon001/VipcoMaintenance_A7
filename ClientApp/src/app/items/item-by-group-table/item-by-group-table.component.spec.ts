import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemByGroupTableComponent } from './item-by-group-table.component';

describe('ItemByGroupTableComponent', () => {
  let component: ItemByGroupTableComponent;
  let fixture: ComponentFixture<ItemByGroupTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemByGroupTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemByGroupTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
