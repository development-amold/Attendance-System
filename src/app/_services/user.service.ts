import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';

import {User} from "../_models/user";
import { environment } from '../../environments/environment';


@Injectable()
export class UserService {
  userModel_Response: any;
  api_uri = environment.BASE_URL;

  constructor(
    private http: HttpClient,
  ) { }

  getUsers() {
    const uri = this.api_uri + '/' + environment.API_ENDPOINT.employees;
    console.log(uri)
    return this.http.get(uri).map(res => {return res;});
  }  

}
