import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../../_services/user.service';
import { ToastrService } from 'ngx-toastr';
// export interface PeriodicElement {
//   name: string;
//   position: number;
//   weight: number;
//   symbol: string;
// }

const ELEMENT_DATA = []

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['srno', 'name', 'email', 'actions'];
  // dataSource = new MatTableDataSource();
    dataSource: any;


  constructor(
    private _userService: UserService,
    private toastr: ToastrService
  ) 
  { 
    console.log(this.dataSource)    
  }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this._userService.getUsers().subscribe(res => {
      console.log(res)
      this.dataSource = res;
    });
    //loads data from here

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
