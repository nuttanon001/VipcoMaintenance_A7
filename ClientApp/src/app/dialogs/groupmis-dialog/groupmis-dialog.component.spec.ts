import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupmisDialogComponent } from './groupmis-dialog.component';

describe('GroupmisDialogComponent', () => {
  let component: GroupmisDialogComponent;
  let fixture: ComponentFixture<GroupmisDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupmisDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupmisDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
