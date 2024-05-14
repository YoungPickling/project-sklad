import { Route } from "@angular/router";
import { WorkspaceComponent } from "./workspace.component";
import { AuthGuard } from "../frontpage/login/auth.guard";

// export const frontpageRoutes: Routes = [
export default [ 
  {
    path: '', 
    component: WorkspaceComponent, 
    pathMatch: 'full'
  }, 
  {
    path: ':companyId', 
    component: WorkspaceComponent, 
    pathMatch: 'full', 
    canActivate: [AuthGuard]
  }
] as Route[];