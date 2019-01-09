import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SparePartViewComponent } from './spare-part-view.component';

describe('SparePartViewComponent', () => {
  let component: SparePartViewComponent;
  let fixture: ComponentFixture<SparePartViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SparePartViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SparePartViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
