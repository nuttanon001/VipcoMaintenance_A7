import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemManitenLinkMailComponent } from './item-maniten-link-mail.component';

describe('ItemManitenLinkMailComponent', () => {
  let component: ItemManitenLinkMailComponent;
  let fixture: ComponentFixture<ItemManitenLinkMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemManitenLinkMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemManitenLinkMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
