import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObsoleteItemMasterComponent } from './obsolete-item-master.component';

describe('ObsoleteItemMasterComponent', () => {
  let component: ObsoleteItemMasterComponent;
  let fixture: ComponentFixture<ObsoleteItemMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObsoleteItemMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObsoleteItemMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
