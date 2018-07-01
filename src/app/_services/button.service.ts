import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class ButtonService {
  private homeButtonSource = new Subject<boolean>();
  homeCurrentButton = this.homeButtonSource.asObservable();
  private loginButtonSource = new Subject<boolean>();
  loginCurrentButton = this.loginButtonSource.asObservable();  

  constructor() { }

  changeHome(status: boolean){
    this.homeButtonSource.next(status);
  }

  updateLoginStatus(status: boolean){
    this.loginButtonSource.next(status);
  }

}
