import { Routes } from '@angular/router';

import { LoadingComponent } from './loading/loading.component';

export const routes: Routes = [
  { 
    path: "workspace", 
    // component: WorkspaceComponent,
    // loadComponent: () =>
    //   import('./workspace/workspace.component').then((mod) => mod.WorkspaceComponent)
    loadChildren: () =>
      import('./workspace/workspace.routes')
  },
  { 
    path: "loading", 
    // component: WorkspaceComponent,
    loadComponent: () =>
      import('./loading/loading.component').then((mod) => mod.LoadingComponent),
  }, 
  { 
    path: "", 
    // pathMatch: 'full',
    loadChildren: () =>
      import('./frontpage/frontpage.routes')
  }, 
  // { path: "**", component: FrontpageComponent }
];
