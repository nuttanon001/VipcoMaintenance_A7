import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMk2DialogComponent } from './item-mk2-dialog.component';

describe('ItemMk2DialogComponent', () => {
  let component: ItemMk2DialogComponent;
  let fixture: ComponentFixture<ItemMk2DialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemMk2DialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMk2DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
