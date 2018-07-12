import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../_services/authentication.service';


@Injectable()
export class CommonHttpInterceptor implements HttpInterceptor {
    constructor(
        private toastr: ToastrService,
        private router: Router,
        private authService: AuthenticationService,
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authReq = req.clone({ headers: req.headers.set('authorization', `Bearer ${this.authService.getToken()}` ) });
        // send the newly created request
        return next.handle(authReq).do((event: HttpEvent<any>) => {

        }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401) {
                    this.toastr.clear();
                    console.log('CommonHttpInterceptor - Response :: Unauthorized');
                    this.toastr.error('UnauthorizedError: invalid token', 'Error');
                    this.router.navigate(['login']);                    
                    // this.toastr.clear();
                    return null;
                }
            }
        });
    }
}


