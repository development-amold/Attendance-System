import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,  Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenPayload, AuthenticationService, UserDetails } from '../_services/authentication.service';
import { Router } from '@angular/router';
import { ButtonService } from '../_services/button.service';
import { ToastrService } from 'ngx-toastr';
import { Globalvar } from '../_shared/globals';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials: any = {
    email: '',
    password: ''
  };

  angForm: FormGroup;
  email: FormControl;
  password: FormControl;
  current_user: UserDetails;
  //imported common UserDetails interface from authenticationService as it restricts the server data to certain types or limited scope i.e. we can show the types of data on views that is defined by the interface/class. If we don't define interface or class(model in angular) then anyone can access all the response getting from the server.

  constructor(
    private authService: AuthenticationService, 
    private router: Router, 
    private _buttonService: ButtonService,
    private toastr: ToastrService,
  ) 
  { 
    this.createFormControls();
    this.createForm();
  }

  ngOnInit() {
    this.goToValidpath();    
  }

  createFormControls() {
    this.email = new FormControl('', [
      Validators.required,
      Validators.pattern("^[A-Za-z0-9]+([\.-]?[a-zA-Z0-9]*)*@[a-zA-Z0-9]+([\.-]?[a-zA-Z0-9]+)*(\.[a-zA-Z0-9]{2,3})+$")  // \w does not work here

    ]);
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
      password: this.password,
    });
  }  

  login() {
    this.authService.login(this.credentials).subscribe(() => {
      this.toastr.success('Logged in successfully', 'Success');
      this.goToValidpath();
    }, (err) => {
      // (message, title, ToastConfig)
      this.toastr.error(err.error.message, "Error");
    }); 
  }
  
  logout() {
    this.authService.logout();
    this.router.navigateByUrl("/");
  }  

  goToValidpath(){
    this.current_user = this.authService.getUserDetails();
    if(this.current_user){
      switch(this.current_user.roleid) {
        case 1:
          this.router.navigateByUrl('/dashboard');
          break;
        case 2:
          this.router.navigateByUrl('/dashboard');
          break;
        case 3:
          this.router.navigateByUrl('/home');
          break;
        default:
        this.router.navigateByUrl('/home');
      } 
    }
  }  
  

}