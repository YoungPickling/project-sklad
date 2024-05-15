import { Route } from "@angular/router";
import { WorkspaceComponent } from "./workspace.component";
import { AuthGuard } from "../frontpage/login/auth.guard";
import { LandingPageComponent } from "./window-templates/landing-page/landing.component";

export default [
  {
    path: '',
    component: WorkspaceComponent,
    pathMatch: 'full',
  },
  {
    path: ':companyId',
    component: WorkspaceComponent,
    pathMatch: 'prefix',
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        // loadComponent: () => import('./window-templates/landing-page/landing.component').then((mod) => mod.LandingPageComponent),
        component: LandingPageComponent, 
      },
    ]
  }
] as Route[];
