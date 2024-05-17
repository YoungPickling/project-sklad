import { Route } from "@angular/router";
import { WorkspaceComponent } from "./workspace.component";
import { AuthGuard } from "../frontpage/login/auth.guard";
import { LandingPageComponent } from "./landing-page/landing.component";
import { GalleryComponent } from "./gallery/gallery.component";
import { UsersComponent } from "./users/users.component";
import { LocationsComponent } from "./locations/locations.component";
import { SuppliersComponent } from "./suppliers/suppliers.component";
import { ItemsComponent } from "./items/items.component";

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
        loadComponent: () => 
          import('./landing-page/landing.component')
          .then((mod) => mod.LandingPageComponent),
      },
      {
        path: 'items',
        component: ItemsComponent,
        // loadComponent: () => 
        //   import('./window-templates/landing-page/landing.component')
        //   .then((mod) => mod.LandingPageComponent),
      },
      {
        path: 'suppliers',
        component: SuppliersComponent,
      },
      {
        path: 'locations',
        component: LocationsComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'gallery',
        component: GalleryComponent,
      },
    ]
  }
] as Route[];
