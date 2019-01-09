import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMaintenMasterComponent } from './item-mainten-master.component';

describe('ItemMaintenMasterComponent', () => {
  let component: ItemMaintenMasterComponent;
  let fixture: ComponentFixture<ItemMaintenMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemMaintenMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMaintenMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
