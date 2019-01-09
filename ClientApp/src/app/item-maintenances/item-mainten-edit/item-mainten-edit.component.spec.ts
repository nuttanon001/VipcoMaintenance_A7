import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMaintenEditComponent } from './item-mainten-edit.component';

describe('ItemMaintenEditComponent', () => {
  let component: ItemMaintenEditComponent;
  let fixture: ComponentFixture<ItemMaintenEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemMaintenEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMaintenEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
