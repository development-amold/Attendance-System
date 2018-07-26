import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceShowComponent } from './attendance-show.component';

describe('AttendanceShowComponent', () => {
  let component: AttendanceShowComponent;
  let fixture: ComponentFixture<AttendanceShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendanceShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
