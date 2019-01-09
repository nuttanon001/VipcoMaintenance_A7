import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupmisTableComponent } from './groupmis-table.component';

describe('GroupmisTableComponent', () => {
  let component: GroupmisTableComponent;
  let fixture: ComponentFixture<GroupmisTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupmisTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupmisTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
