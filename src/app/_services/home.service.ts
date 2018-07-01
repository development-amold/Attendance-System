import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class HomeService {
  api_uri = environment.base_api_url;
  constructor(private http: HttpClient) {

   }

  getUsers() {
    const uri = this.api_uri + '/api/home';
    return this.http.get(uri).map(res => {return res;});
  }  

}
