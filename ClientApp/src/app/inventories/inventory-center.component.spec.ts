import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryCenterComponent } from './inventory-center.component';

describe('InventoryCenterComponent', () => {
  let component: InventoryCenterComponent;
  let fixture: ComponentFixture<InventoryCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
