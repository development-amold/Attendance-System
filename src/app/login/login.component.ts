import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,  Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenPayload, AuthenticationService } from '../_services/authentication.service';
import { Router } from '@angular/router';
import { ButtonService } from '../_services/button.service';

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

  constructor(private authService: AuthenticationService, private router: Router, private _buttonService: ButtonService) { 
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
    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(8)
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
      this.router.navigateByUrl('/home');
    }, (err) => {
      console.error(err);
    }); 
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl("/");
  }  
  

}