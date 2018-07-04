import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(private router: Router)
  {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean 
    {
      const token = localStorage.getItem('access_token');
      if (token && token !== '' && token !== null && token !== 'null') {
        // if user is logged in & if users === is_admin then redirect to dashboard else redirect to frontend
        return true;
      }
      else{
        this.router.navigate(['/login']);
        return false;
      }


    
  }
}
