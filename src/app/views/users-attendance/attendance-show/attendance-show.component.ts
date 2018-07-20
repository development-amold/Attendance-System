import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../_services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginRecord } from '../../../_models/loginRecord';


@Component({
  selector: 'app-attendance-show',
  templateUrl: './attendance-show.component.html',
  styleUrls: ['./attendance-show.component.css']
})
export class AttendanceShowComponent implements OnInit {
  loginRecordModel: any;

  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    this._route.params.subscribe(params => {
      this.loginRecordModel = this._userService.viewAttendance(params['id']).subscribe(res => {
        this.loginRecordModel = res;
      });
    });       
  }

}
