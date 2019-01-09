import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachFileViewComponent } from './attach-file-view.component';

describe('AttachFileViewComponent', () => {
  let component: AttachFileViewComponent;
  let fixture: ComponentFixture<AttachFileViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachFileViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachFileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
