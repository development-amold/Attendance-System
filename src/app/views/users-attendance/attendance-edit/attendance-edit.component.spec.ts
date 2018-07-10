import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceEditComponent } from './attendance-edit.component';

describe('AttendanceEditComponent', () => {
  let component: AttendanceEditComponent;
  let fixture: ComponentFixture<AttendanceEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendanceEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
