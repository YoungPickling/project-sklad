import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot, UrlTree, CanActivateChild } from "@angular/router";
import { AuthService } from "./auth.service";
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map, switchMap, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
private isFirstVisit = true;

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    routerState: RouterStateSnapshot
  ):
    boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    // return this.authService.user.pipe(
    return this.authService.user.pipe(
      take(1),
      map(user => !!user),
      switchMap(isAuth => {
        const currentUrl = routerState.url;

        // Check if this is the first visit to 'workspace/0'
        // if (currentUrl.includes('workspace/0')) {
        //   if (this.isFirstVisit) {
        //     this.isFirstVisit = false;

        //     // Simulate loading screen
        //     return of(this.router.createUrlTree(['loading'])).pipe(
        //       delay(100),
        //       map(() => {
        //         return this.router.createUrlTree([currentUrl]);
        //       })
        //     );
        //   } else {
        //     // Allow access to 'workspace/0' after the first visit
        //     return of(true);
        //   }
        // }

        // If the user is authenticated, allow access
        if (isAuth) return of(true);

        // Redirect to 'loading' if not authenticated
        return of(this.router.createUrlTree(['loading']));
      })
    );
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot,
  ): 
  boolean 
  | UrlTree 
  | Promise<boolean | UrlTree> 
  | Observable<boolean | UrlTree> {
    return this.canActivate(route, router);
  }
}