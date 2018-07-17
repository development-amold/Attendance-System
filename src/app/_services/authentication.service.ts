import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ButtonService } from './button.service';
import { ToastrService } from 'ngx-toastr';


export interface UserDetails { //this is similar content as that of attendance-system\node-api\models\users.js //generateJwt => model : dataType -> we can use it in angular views
  id: string;
  email: string;
  roleid: number;
  name: string;
  exp: number; // expiry time im milliseconds
  iat: number; //created_at or issued_at
  is_active: boolean;
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  email: string;
  password: string;
  name?: string;
}

@Injectable()
export class AuthenticationService {
  private token: string = '';

  constructor(
    private http: HttpClient,
    private router: Router, 
    private _buttonService: ButtonService,
    private toastr: ToastrService
  ) 
  {}

  private saveToken(token: string): void {
    localStorage.setItem('access_token', token);
    this.token = token;
  }

  public getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('access_token');
    }
    return this.token;
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload); //The atob() method decodes a base-64 encoded string. This method decodes a string of data which has been encoded by the btoa() method.
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    var current_date_time = new Date().getTime();
    if (user) {
      if (user.exp > (current_date_time))  //current_date_time greater than expiry date time
      {
        // this._buttonService.updateLoginStatus(true);
        return true;
      }
      else
      {
        // this._buttonService.updateLoginStatus(false);
        return false;
      }
    } else {
      // this._buttonService.updateLoginStatus(false);
      return false;
    }
  }

  private request(method: 'post'|'get', type: 'login'|'register'|'profile', user?: TokenPayload): Observable<any> {
    let base;
    
    if (method === 'post') {
      base = this.http.post(`${environment.BASE_URL}/api/${type}`, user);
    } else {
      base = this.http.get(`${environment.BASE_URL}/api/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }});
    }

    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );

    return request;
  }

  public register(user: TokenPayload): Observable<any> {
    return this.request('post', 'register', user);
  }

  public login(user: TokenPayload): Observable<any> {
    return this.request('post', 'login', user);
  }

  public profile(): Observable<any> {
    return this.request('get', 'profile');
  }

  public logout(): void {
    this.token = '';
    this._buttonService.updateLoginStatus(false);
    this.toastr.success('LogOut successfully', 'Success');
    localStorage.clear();
  }
}