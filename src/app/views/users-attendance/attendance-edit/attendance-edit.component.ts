import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,  Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserService } from '../../../_services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NavigationService } from '../../../_services/navigation.service';
import { LoginRecord } from '../../../_models/loginRecord';


@Component({
  selector: 'app-attendance-edit',
  templateUrl: './attendance-edit.component.html',
  styleUrls: ['./attendance-edit.component.css']
})
export class AttendanceEditComponent implements OnInit {
  current_date_time = `${new Date().getHours()}:${new Date().getMinutes()}`;
  loginRecordModel: LoginRecord = {
    login_date: new Date(),
    in_time: '',
    out_time: '',
    task: ''      
  };

  editLoginRecord: any;

  angForm: FormGroup;
  login_date: FormControl;
  in_time: FormControl;
  out_time: FormControl;
  task: FormControl;
  
  maxDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  constructor(
    private _userService: UserService,
    private _router: Router,
    private toastr: ToastrService,
    private navService: NavigationService,
    private _route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.createFormControls();
    this.createForm();    
    this._route.params.subscribe(params => {
      this._userService.editLoginRecord(params['id']).subscribe(res => {
        this.loginRecordModel.login_date = res["login_date"];
        this.loginRecordModel.in_time = res["in_time"];
        this.loginRecordModel.out_time = res["out_time"];
        this.loginRecordModel.task = res["task"];
        
      });
    });                
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

  updateLoginRecord(){
    this._userService.updateLoginRecord(this.loginRecordModel).subscribe(res => {
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
