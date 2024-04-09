import { Routes } from '@angular/router';
import { WorkspaceComponent } from './workspace/workspace.component';
import { FrontpageComponent } from './frontpage/frontpage.component';

export const routes: Routes = [
  { 
    path: "workspace", 
    // component: WorkspaceComponent,
    loadComponent: () =>
      import('./workspace/workspace.component').then((mod) => mod.WorkspaceComponent)
  }, 
  { 
    path: "", 
    // pathMatch: 'full',
    loadChildren: () =>
      import('./frontpage/frontpage.routes')
  }, 
  // { path: "**", component: FrontpageComponent }
];
