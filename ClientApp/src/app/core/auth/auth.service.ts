import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
// rxjs
import { Observable, BehaviorSubject } from "rxjs";
import { catchError, map } from "rxjs/operators";
// model
import { User } from "../../users/shared/user.model";


@Injectable()
export class AuthService {
  userName: string;
  authKey = "auth";
  // store the URL so we can redirect after logging in
  redirectUrl: string;
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    private http:HttpClient
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(user: User): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        // "Authorization": "my-auth-token"
      })
    };

    //debug
    //console.log("Login");

    return this.http.post<User>
      ("api/User/Login/", JSON.stringify(user), httpOptions)
      .pipe(
      map((user) => {
        // this.setAuth = dbUser;
        // this.userName = dbUser.UserName; //data.UserName;
        if (user && user.Token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return user;
      })).shareReplay();
    /*
      We are calling shareReplay to prevent the receiver of this Observable from accidentally
      triggering multiple POST requests due to multiple subscriptions.
      Before processing the login response, let's first follow the flow of the
      request and see what happens on the server.
     */
  }

  logout() {
    // console.log("logout AuthService");
    //this.setAuth = null;
    //this.userName = "";
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    // return false;
  }

  // Converts a Json object to urlencoded format
  toUrlEncodedString(data: any) {
    let body = "";
    for (let key in data) {
      if (body.length) {
        body += "&";
      }
      body += key + "=";
      body += encodeURIComponent(data[key]);
    }
    return body;
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  // Retrieves the auth JSON object (or NULL if none)
  get getAuth(): User | undefined {
    let i = localStorage.getItem('currentUser');
    if (i) {
      return JSON.parse(i);
    }
    else {
      return undefined;
    }
  }
}
