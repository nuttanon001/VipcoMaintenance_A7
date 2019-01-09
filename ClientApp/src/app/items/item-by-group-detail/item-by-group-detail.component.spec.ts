import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemByGroupDetailComponent } from './item-by-group-detail.component';

describe('ItemByGroupDetailComponent', () => {
  let component: ItemByGroupDetailComponent;
  let fixture: ComponentFixture<ItemByGroupDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemByGroupDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemByGroupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
