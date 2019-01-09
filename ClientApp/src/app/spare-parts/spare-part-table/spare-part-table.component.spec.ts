import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SparePartTableComponent } from './spare-part-table.component';

describe('SparePartTableComponent', () => {
  let component: SparePartTableComponent;
  let fixture: ComponentFixture<SparePartTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SparePartTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SparePartTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
