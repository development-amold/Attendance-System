import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../../_services/user.service';
import { ToastrService } from 'ngx-toastr';
import { IfObservable } from 'rxjs/observable/IfObservable';
import { User } from '../../../_models/user';

import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { Subject } from 'rxjs/Subject';
import { catchError, map, tap, startWith, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['srno', 'name', 'email', 'actions'];

    users_data: User[];
  
    length = 0;
    pageSize = 10;
    pageSizeOptions = [5, 10, 25, 100];

    dataSource = new MatTableDataSource();    

    @ViewChild(MatPaginator) myPaginator: MatPaginator;
    @ViewChild(MatSort) mySort: MatSort;    

  constructor(
    private _userService: UserService,
    private toastr: ToastrService
  ) 
  { 
    
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
          return this._userService.getUsers(
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
              this.users_data = _response.users_data;
              this.length  = (_response.total_users_count ? _response.total_users_count : 0);  //total users count
              return this.users_data;
            } else {
              console.log(_response)
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


  deleteUser(user):void{
    if(confirm("Are you sure want to delete?")){
      this._userService.deleteUser(user._id).subscribe(res => {
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

  toggleActivation(user): void{
    let toggleVal = true;
    if(user.is_active === true){
      if(confirm("Are you sure want to de-activate account?")){
        toggleVal = false;
        this.toggleActivationService(user._id,toggleVal)
      }  
    }else{
      if(confirm("Are you sure want to activate account?")){
        toggleVal = true;
        this.toggleActivationService(user._id,toggleVal)        
      }      
    }
  }

  toggleActivationService(userid,toggleVal){
    this._userService.toggleActivation(userid,toggleVal).subscribe(res => {
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
