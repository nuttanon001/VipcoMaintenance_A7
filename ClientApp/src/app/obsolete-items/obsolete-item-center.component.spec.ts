import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObsoleteItemCenterComponent } from './obsolete-item-center.component';

describe('ObsoleteItemCenterComponent', () => {
  let component: ObsoleteItemCenterComponent;
  let fixture: ComponentFixture<ObsoleteItemCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObsoleteItemCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObsoleteItemCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
