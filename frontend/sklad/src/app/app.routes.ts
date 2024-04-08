import { Routes } from '@angular/router';
import { WorkspaceComponent } from './workspace/workspace.component';
import { FrontpageComponent } from './frontpage/frontpage.component';

export const routes: Routes = [
  { path: "", component: FrontpageComponent }, //workspace
  { path: "workspace", component: WorkspaceComponent }, //workspace
];
