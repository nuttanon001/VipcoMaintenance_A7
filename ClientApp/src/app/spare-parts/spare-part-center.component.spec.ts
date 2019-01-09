import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SparePartCenterComponent } from './spare-part-center.component';

describe('SparePartCenterComponent', () => {
  let component: SparePartCenterComponent;
  let fixture: ComponentFixture<SparePartCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SparePartCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SparePartCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
