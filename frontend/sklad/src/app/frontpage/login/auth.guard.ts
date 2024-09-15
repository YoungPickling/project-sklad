import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot, UrlTree, CanActivateChild } from "@angular/router";
import { AuthService } from "./auth.service";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    return this.authService.user.pipe(
      take(1),
      map(user => {
        // console.log('User in guard:', user);
        const isAuth = !!user;
        if (isAuth) {
          return true;
        }
        // console.log('returning login page')
        return this.router.createUrlTree(['loading']);
      })
    );
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot,
  ): any {
    return this.canActivate(route, router);
  }
}