import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMaintenManhourComponent } from './item-mainten-manhour.component';

describe('ItemMaintenManhourComponent', () => {
  let component: ItemMaintenManhourComponent;
  let fixture: ComponentFixture<ItemMaintenManhourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemMaintenManhourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMaintenManhourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
