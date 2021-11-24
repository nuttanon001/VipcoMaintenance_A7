import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
// rxjs
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';
// model
import { MenuUser, User } from '../../users/shared/user.model';


@Injectable()
export class AuthService {
  userName: string;
  authKey = 'auth';
  tempUser?: User;
  // store the URL so we can redirect after logging in
  redirectUrl: string;
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    private http: HttpClient
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(user: User): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // "Authorization": "my-auth-token"
      })
    };

    // debug
    // console.log("Login");
    /*
    return this.http.post<User>
      ('api/User/Login/', JSON.stringify(user), httpOptions)
      .pipe(
        shareReplay(),
        map((user1) => {
        // this.setAuth = dbUser;
        if (user1 && user1.Token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user1));
          this.currentUserSubject.next(user1);
        }
        return user1;
      })).shareReplay();
    */

    return this.http.post<User>
      ('api/User/Login/', JSON.stringify(user), httpOptions)
      .pipe(
        shareReplay(),
        // tslint:disable-next-line:no-shadowed-variable
        switchMap((user) => {
          // Template user
          this.tempUser = user;
          if (this.tempUser) {
            const options = this.tempUser ? { params: new HttpParams().set('key', this.tempUser.EmpCode) } : {};
            return this.http.get<MenuUser[]>('http://192.168.2.31/extends-sagex3/api/UserDetail/GetMenu', options);
          } else {
            const noMenu: Array<MenuUser> = [];
            return of(noMenu);
          }
        }), map((menus: Array<MenuUser>) => {
          // debug here
          // console.log(JSON.stringify(menus));
          if (menus) {
            // debug here
            // console.log("Has menu");
            this.tempUser.AuthMenu = menus.slice();
          }

          if (this.tempUser && this.tempUser.Token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(this.tempUser));
            this.currentUserSubject.next(this.tempUser);
          }

          return this.tempUser;
        }));
    /*
      We are calling shareReplay to prevent the receiver of this Observable from accidentally
      triggering multiple POST requests due to multiple subscriptions.
      Before processing the login response, let's first follow the flow of the
      request and see what happens on the server.
     */
  }

  logout() {
    // console.log("logout AuthService");
    // this.setAuth = null;
    // this.userName = "";
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    // return false;
  }

  // Converts a Json object to urlencoded format
  toUrlEncodedString(data: any) {
    let body = '';
    // tslint:disable-next-line:forin
    for (const key in data) {
      if (body.length) {
        body += '&';
      }
      body += key + '=';
      body += encodeURIComponent(data[key]);
    }
    return body;
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  // Retrieves the auth JSON object (or NULL if none)
  get getAuth(): User | undefined {
    const i = localStorage.getItem('currentUser');
    if (i) {
      return JSON.parse(i);
    } else {
      return undefined;
    }
  }
}
