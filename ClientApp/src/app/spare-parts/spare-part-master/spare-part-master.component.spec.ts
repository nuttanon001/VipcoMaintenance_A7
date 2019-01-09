import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SparePartMasterComponent } from './spare-part-master.component';

describe('SparePartMasterComponent', () => {
  let component: SparePartMasterComponent;
  let fixture: ComponentFixture<SparePartMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SparePartMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SparePartMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
