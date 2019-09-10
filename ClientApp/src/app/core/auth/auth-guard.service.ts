import { Injectable } from "@angular/core";
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  CanLoad, Route
} from "@angular/router";

import { AuthService } from "./auth.service";
import * as moment from "moment";

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let url: string = state.url;

    return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): boolean {
    let url = `/${route.path}`;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    const currentUser = this.authService.currentUserValue;

    if (currentUser && currentUser.ValidTo) {
      const validDate: moment.Moment = moment.utc(currentUser.ValidTo);
      const toDay: moment.Moment = moment.utc();
      const diff: number = toDay.diff((validDate), "minute");
      if (diff < 1) {
        // logged in so return true
        return true;
      }
    }
    // Set url
    if (url) {
      this.authService.redirectUrl = url;
    }
    // Navigate to the login page
    this.router.navigate(["login/"]);
    return false;
  }
}
