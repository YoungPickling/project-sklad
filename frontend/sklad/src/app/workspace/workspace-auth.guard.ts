// import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
// import { catchError, map } from "rxjs";
// import { AuthService } from "../frontpage/login/auth.service";
// import { inject } from "@angular/core";

// export const canActivate: CanActivateFn = (
//   route: ActivatedRouteSnapshot,
//   state: RouterStateSnapshot
// ) => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   return authService.checkLogin().pipe(
//     map(() => true),
//     catchError(() => {
//       return router.createUrlTree(['route-to-fallback-page']);
//     })
//   );
// };

// export const canActivateChild: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => canActivate(route, state);