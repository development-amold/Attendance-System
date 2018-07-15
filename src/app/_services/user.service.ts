import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';

import {User} from "../_models/user";
import { environment } from '../../environments/environment';


@Injectable()
export class UserService {
  userModel_Response: any;
  api_uri = environment.BASE_URL + '/api';

  constructor(
    private http: HttpClient,
  ) { }

  getUsers(sortCol: string, sortOrder: string, pageIndex: number, pageLimit: number): Observable<any>  {
    const uri_endpoint = this.api_uri + '/' + environment.API_ENDPOINT.employees;
    const reqUrl = `${uri_endpoint}?sortCol=${sortCol}&sortOrder=${sortOrder}&pageIndex=${pageIndex}&pageLimit=${pageLimit}`;
    return this.http.get(reqUrl).map(res => {return res;});
  }  

  addUser(user: User):Observable<User>{
    const uri = this.api_uri + '/' + environment.API_ENDPOINT.addEmployee;
    return this.http.post<User>(uri,user)//.map(res => {console.log(res);return res;});    
  }

  deleteUser(id):Observable<User>{
    const uri = this.api_uri + '/' + environment.API_ENDPOINT.deleteEmployee + '/' + id;
    return this.http.delete<User>(uri)
  }  

  toggleActivation(id,togglevalue):Observable<User>{
    const uri = this.api_uri + '/' + environment.API_ENDPOINT.userActivation + '/' + id;
    return this.http.post<User>(uri,{toggleVal: togglevalue}) //payload or requested-data must the object
  }  

  getLoginRecords(sortCol: string, sortOrder: string, pageIndex: number, pageLimit: number): Observable<any>  {
    const uri_endpoint = this.api_uri + '/' + environment.API_ENDPOINT.login_records;
    const reqUrl = `${uri_endpoint}?sortCol=${sortCol}&sortOrder=${sortOrder}&pageIndex=${pageIndex}&pageLimit=${pageLimit}`;
    return this.http.get(reqUrl).map(res => {return res;});
  }
  

}
