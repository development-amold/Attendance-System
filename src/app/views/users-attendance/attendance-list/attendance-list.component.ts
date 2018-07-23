import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { UserService } from '../../../_services/user.service';
import { ToastrService } from 'ngx-toastr';

import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { Subject } from 'rxjs/Subject';
import { catchError, map, tap, startWith, switchMap } from 'rxjs/operators';
import { LoginRecord } from '../../../_models/loginRecord';
import {GlobarvarService} from '../../../_services/globarvar.service';
import { AuthenticationService } from '../../../_services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.css']
})
export class AttendanceListComponent implements OnInit, AfterViewInit {
  current_user: any;
  displayedColumns: string[];

  loginRecords_data: LoginRecord [];
  length = 0;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];

  dataSource = new MatTableDataSource();    

  @ViewChild(MatPaginator) myPaginator: MatPaginator;
  @ViewChild(MatSort) mySort: MatSort;    

  constructor(
    private _userService: UserService,
    private toastr: ToastrService,
    private _globalService: GlobarvarService,
    private authService: AuthenticationService,
    private _router: Router
  ) 
  { 
    this.current_user = this.authService.getUserDetails();
    if(this.current_user.roleid == 3){
      this.displayedColumns = ['srno', 'login_date','inTime','outTime','actions'];
    }else{
      this.displayedColumns = ['srno', 'email', 'login_date','inTime','outTime','actions'];
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    try {
      this.mySort.sortChange.subscribe(() => this.myPaginator.pageIndex = 0);
      merge(this.mySort.sortChange, this.myPaginator.page)
        .pipe(
        startWith({}),
        switchMap(() => {
          // this.isLoadingResults = true;
          return this._userService.getLoginRecords(
            this.mySort.active, //sorted_column_name
            this.mySort.direction,
            this.myPaginator.pageIndex,
            this.myPaginator.pageSize
          );
        }),
        map(_response => {
          try {
            if (_response.msgCode === "success") {
              // this.isLoadingResults = false;
              // this.isRateLimitReached = false;
              this.loginRecords_data = _response.loginRecords_data;
              this.length  = (_response.total_rec_count ? _response.total_rec_count : 0);  //total users count
              // console.log(this.loginRecords_data)
              return this.loginRecords_data;
            } else {
              // console.log(_response)
              try {
                // this.toastr.error(this.rSM.resMsg[_response.status][this.globals.lang],
                  // this.rSM.genericsMsg.errorTitile[this.globals.lang]);
                return [];
              } catch (err) {
                // this.toastr.error(this.rSM.genericsMsg.errorMessage[this.globals.lang],
                  // this.rSM.genericsMsg.errorTitile[this.globals.lang]);
                return [];
              }
            }
          } catch (err) {
            // this.toastr.error(this.rSM.genericsMsg.errorMessage[this.globals.lang],
              // this.rSM.genericsMsg.errorTitile[this.globals.lang]);
            return [];
          } // err
        },
          _error => {
            try {
              // this.isLoadingResults = false;
              // this.isRateLimitReached = false;
              // this.toastr.error(this.rSM.resMsg[_error.status][this.globals.lang],
              //   this.rSM.genericsMsg.errorTitile[this.globals.lang]);
              return [];

            } catch (err) {
              // this.isLoadingResults = false;
              // this.isRateLimitReached = false;
              // this.toastr.error(this.rSM.genericsMsg.errorMessage[this.globals.lang],
              //   this.rSM.genericsMsg.errorTitile[this.globals.lang]);
              return [];
            } // err
          }
        ),
        catchError((_error) => {
          // this.isLoadingResults = false;
          // this.isRateLimitReached = true;
          try {
            // this.isLoadingResults = false;
            // this.isRateLimitReached = false;
            // this.toastr.error(this.rSM.resMsg[_error.status][this.globals.lang],
              // this.rSM.genericsMsg.errorTitile[this.globals.lang]);

          } catch (err) {
            // this.isLoadingResults = false;
            // this.isRateLimitReached = false;
            // this.toastr.error(this.rSM.genericsMsg.errorMessage[this.globals.lang],
            //   this.rSM.genericsMsg.errorTitile[this.globals.lang]);
            return [];
          } // err
          return observableOf([]);
        })
        ).subscribe((_response) => {
          // this.loading = false;
          // this.isLoadingResults = false;
          this.dataSource = _response;
        });

    } catch (err) {
      // this.loading = false;
      // this.toastr.error(this.rSM.genericsMsg.errorMessage[this.globals.lang],
      //   this.rSM.genericsMsg.errorTitile[this.globals.lang]);
    }

  }

  showLoginRecord(element){
    this._router.navigate([`/attendance/${element.login_recordsid}`]);
  }

  editLoginRecord(element){
    this._router.navigate([`/attendance/${element.login_recordsid}/edit`]);
  }

  deleteRecord(userid,login_recordid):void{
    if(confirm("Are you sure want to delete?")){
      this._userService.deleteloginRecord(userid,login_recordid).subscribe(res => {
        if(res["msgCode"] == "error"){
          this.toastr.error(res["message"],res["msgCode"]);
        }else{
          this.ngAfterViewInit();
          this.toastr.success(res["message"],res["msgCode"]);
        }
      },(err) => {
        console.log(err.message)
      });
    }
  }



}
