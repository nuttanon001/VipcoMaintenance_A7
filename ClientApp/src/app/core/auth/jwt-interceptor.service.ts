import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptorService {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    //debug here
    // console.log("Intercept");
    let currentUser = this.authService.getAuth;
    if (currentUser && currentUser.Token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.Token}`
        }
      });
    }

    return next.handle(request);
  }
}
