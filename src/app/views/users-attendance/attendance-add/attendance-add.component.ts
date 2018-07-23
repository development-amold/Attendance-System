import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,  Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserService } from '../../../_services/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NavigationService } from '../../../_services/navigation.service';
import { LoginRecord } from '../../../_models/loginRecord';


@Component({
  selector: 'app-attendance-add',
  templateUrl: './attendance-add.component.html',
  styleUrls: ['./attendance-add.component.css']
})
export class AttendanceAddComponent implements OnInit {
  current_date_time = `${new Date().getHours()}:${new Date().getMinutes()}`;
  loginRecordModel: LoginRecord = {
    login_date: new Date(),
    in_time: '',
    out_time: '',
    task: ''      
  };

  angForm: FormGroup;
  login_date: FormControl;
  in_time: FormControl;
  out_time: FormControl;
  task: FormControl;

  
  // login_date_filter = (d: Date): boolean => {
  //   const day = d.getDay();
  //   return day !== 0 && day !== 6;  // Prevent Saturday and Sunday from being selected.
  // }

  maxDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  constructor(
    private _userService: UserService,
    private _router: Router,
    private toastr: ToastrService,
    private navService: NavigationService
  ) {
      this.createFormControls();
      this.createForm();        
   }

  ngOnInit() {

  }

  createFormControls() {
    this.login_date = new FormControl('', [Validators.required,

    ]);
    this.in_time = new FormControl('',Validators.required);
    this.out_time = new FormControl('',Validators.required);
    this.task = new FormControl('',Validators.required);
  }

  createForm() {
    this.angForm = new FormGroup({
      login_date: this.login_date,
      in_time: this.in_time,
      out_time: this.out_time,
      task: this.task
    });
  }      

  loginDateErrorMsg(){
    if(this.login_date.hasError('required')){
      return "Date is required"
    }
  }

  in_timeErrorMsg(){
    if(this.in_time.hasError('required')){
      return "In-time is required"
    }
  }

  out_timeErrorMsg(){
    if(this.out_time.hasError('required')){
      return "Out-time is required"
    }
  } 
  
  taskErrorMsg(){
    if(this.task.hasError('required')){
      return "Task is required"
    }    
  }

  saveLoginRecord(){
    this._userService.addLoginRecord(this.loginRecordModel).subscribe(res => {
      if(res["msgCode"] == "error"){
        this.toastr.error(res["message"],res["msgCode"]);
      }else{
        this.toastr.success(res["message"],res["msgCode"]);
        this.navService.setNavActiveClass("/attendance");
        this._router.navigate(["/attendance"]);
      }
    },(err) => {
      console.error(err.message);
    }    
  );
  }

}
