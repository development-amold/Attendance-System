import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../../_services/user.service';

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
  displayedColumns: string[] = ['srno', 'name', 'email'];
  // dataSource = new MatTableDataSource();
    dataSource: any;


  constructor(
    private _userService: UserService
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
 

}
