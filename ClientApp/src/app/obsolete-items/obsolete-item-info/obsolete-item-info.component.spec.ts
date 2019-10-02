import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObsoleteItemInfoComponent } from './obsolete-item-info.component';

describe('ObsoleteItemInfoComponent', () => {
  let component: ObsoleteItemInfoComponent;
  let fixture: ComponentFixture<ObsoleteItemInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObsoleteItemInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObsoleteItemInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
