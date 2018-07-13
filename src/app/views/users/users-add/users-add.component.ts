import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,  Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../_models/user';
import { UserService } from '../../../_services/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NavigationService } from '../../../_services/navigation.service';

@Component({
  selector: 'app-users-add',
  templateUrl: './users-add.component.html',
  styleUrls: ['./users-add.component.css']
})
export class UsersAddComponent implements OnInit {
  // email = new FormControl('', [Validators.required, Validators.email]);
  userModel: User = {
    name: '',
    email: '',
    password: '',
    roleid: 3,
    is_active: true
  };

  angForm: FormGroup;
  email: FormControl;
  name: FormControl;
  password: FormControl;

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
    this.email = new FormControl('', [
      Validators.required,
      Validators.pattern("^[A-Za-z0-9]+([\.-]?[a-zA-Z0-9]*)*@[a-zA-Z0-9]+([\.-]?[a-zA-Z0-9]+)*(\.[a-zA-Z0-9]{2,3})+$")  // \w does not work here

    ]);
    this.name = new FormControl('',Validators.required);
    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      // Validators.maxLength(16)
      // Validators.pattern('/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/')
    ]);
  }

  createForm() {
    this.angForm = new FormGroup({
      email: this.email,
      name: this.name,
      password: this.password,
    });
  }    

  getErrorMsg(){
      if(this.email.hasError('required')){
        return "Email is required"
      }
      if(this.email.hasError('pattern')){
        return "Email must be valid"
      }      
  }

  getErrorMsg1(){
      if(this.password.hasError('required')){
        return "Password is required"
      }
      
      if(this.password.errors.minlength.actualLength < 8){
        return `Password must be 8 characters long, we need another ${this.password.errors.minlength.requiredLength - this.password.errors.minlength.actualLength} characters`
      }      
    
  }

  getErrorMsg2(){
      if(this.name.hasError('required')){
        return "Name is required"
      }
  }

  saveUser(){
    this._userService.addUser(this.userModel).subscribe(res => {
      if(res["msgCode"] == "error"){
        this.toastr.error(res["message"],res["msgCode"]);
      }else{
        this.toastr.success(res["message"],res["msgCode"]);
        this.navService.setNavActiveClass("/dashboard/employees");
        this._router.navigate(["/dashboard/employees"]);
      }
    },(err) => {
      console.error(err.message);
    }
  );
    
  }

}

/* 
<!-- <div class="invalid-feedback" *ngIf="password.errors && (password.dirty || password.touched)">
<p *ngIf="password.errors.required">Password is required</p>
<!-- <p *ngIf="password.errors.pattern">Password must be valid</p> -->
<p *ngIf="password.errors.minlength">Password must be 8 characters long, we need another {{password.errors.minlength.requiredLength - password.errors.minlength.actualLength}} characters </p>
</div> -->
*/