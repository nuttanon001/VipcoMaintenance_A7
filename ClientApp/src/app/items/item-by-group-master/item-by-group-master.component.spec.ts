import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemByGroupMasterComponent } from './item-by-group-master.component';

describe('ItemByGroupMasterComponent', () => {
  let component: ItemByGroupMasterComponent;
  let fixture: ComponentFixture<ItemByGroupMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemByGroupMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemByGroupMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
