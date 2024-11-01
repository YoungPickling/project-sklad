import { Route } from "@angular/router";
import { WorkspaceComponent } from "./workspace.component";
// import { GalleryComponent } from "./gallery/gallery.component";
// import { UsersComponent } from "./users/users.component";
// import { LocationsComponent } from "./locations/locations.component";
// import { SuppliersComponent } from "./suppliers/suppliers.component";
// import { ItemsComponent } from "./items/items.component";
// import { DiagramsComponent } from "./diagrams/diagrams.component";
import { AuthGuard } from "../frontpage/login/auth.guard";
// import { GroupsComponent } from "./groups/groups.component";
import { canActivateEvaluation } from "./evaluation.guard";

const pages: any = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => 
      import('./landing-page/landing.component')
      .then((mod) => mod.LandingPageComponent),
  },
  {
    path: 'items',
    // component: ItemsComponent,
    loadComponent: () => 
      import('./items/items.component')
      .then((mod) => mod.ItemsComponent),
  },
  {
    path: 'suppliers',
    // component: SuppliersComponent,
    loadComponent: () => 
      import('./suppliers/suppliers.component')
      .then((mod) => mod.SuppliersComponent)
  },
  {
    path: 'locations',
    // component: LocationsComponent,
    loadComponent: () => 
      import('./locations/locations.component')
      .then((mod) => mod.LocationsComponent)
  },
  {
    path: 'users',
    // component: UsersComponent,
    loadComponent: () => 
      import('./users/users.component')
      .then((mod) => mod.UsersComponent)
  },
  {
    path: 'gallery',
    // component: GalleryComponent,
    loadComponent: () => 
      import('./gallery/gallery.component')
      .then((mod) => mod.GalleryComponent)
  },
  {
    path: 'diagrams',
    // component: DiagramsComponent,
    loadComponent: () => 
      import('./diagrams/diagrams.component')
      .then((mod) => mod.DiagramsComponent)
  },
  {
    path: 'groups',
    // component: GroupsComponent,
    loadComponent: () => 
      import('./groups/groups.component')
      .then((mod) => mod.GroupsComponent),
  },
]

export default [
  // {
  //   path: '',
  //   component: WorkspaceComponent,
  //   pathMatch: 'full',
  // }, 
  {
    path: '0',
    component: WorkspaceComponent,
    pathMatch: 'prefix',
    canActivateChild: [canActivateEvaluation],
    children: pages
  }, {
    path: ':companyId',
    component: WorkspaceComponent,
    pathMatch: 'prefix',
    canActivateChild: [AuthGuard],
    children: pages
  }, 
] as Route[];
