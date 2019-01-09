import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { Router } from '@angular/router';


@Injectable()
export class ErrorInterceptorService implements HttpInterceptor  {

  constructor(private router: Router,private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      console.log(err.status);

      if (err.status === 401) {
        // auto logout if 401 response returned from api
        // console.log("logout error intercept");
        this.authService.logout();

        // console.log("intercept error");
        // location.reload(true);
        this.router.navigate(['/login']);
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
    }))
  }
}
