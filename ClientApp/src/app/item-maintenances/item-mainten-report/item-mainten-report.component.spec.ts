import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMaintenReportComponent } from './item-mainten-report.component';

describe('ItemMaintenReportComponent', () => {
  let component: ItemMaintenReportComponent;
  let fixture: ComponentFixture<ItemMaintenReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemMaintenReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMaintenReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
