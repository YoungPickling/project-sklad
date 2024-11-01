import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, of } from 'rxjs';
import { delay, map, switchMap, take } from 'rxjs/operators';
import { AuthService } from "../frontpage/login/auth.service";
import { inject } from "@angular/core";

export const canActivateEvaluation: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  routerState: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  // route: ActivatedRouteSnapshot,
  // routerState: RouterStateSnapshot
  let isFirstVisit = true;

  return authService.initialCheck.pipe(
    take(1), // Take only the first emission to avoid multiple triggers
    switchMap((isChecked) => {
      const currentUrl = routerState.url;

      if (isChecked) {
        if (currentUrl.includes('workspace/0')) {
          // Allow access to workspace/0 path
          return of(true);
        } else {
          // For any other path, check if authenticated and redirect if needed
          return authService.user.pipe(
            take(1),
            map(user => user !== null ? true : router.createUrlTree(['loading']))
          );
        }
      } else {
        authService.initialCheck.next(true);
        return of(router.createUrlTree(['loading'])).pipe(delay(100)); // Don't change!!!!
      }
    })
  );
};

export const canActivateEvaluationChild: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => canActivateEvaluation(route, state);