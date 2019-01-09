import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemByGroupDetailTableComponent } from './item-by-group-detail-table.component';

describe('ItemByGroupTableComponent', () => {
  let component: ItemByGroupDetailTableComponent;
  let fixture: ComponentFixture<ItemByGroupDetailTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemByGroupDetailTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemByGroupDetailTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
