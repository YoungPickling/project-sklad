import { Route } from "@angular/router";
import { FrontpageComponent } from "./frontpage.component";
import { MainComponent } from "./main/main.component";
import { AboutComponent } from "./about/about.component";
import { LoginComponent } from "./login/login.component";

// export const frontpageRoutes: Routes = [
export default [
  { 
    path: '', 
    component: FrontpageComponent,
    children: [
      { path: '', component: MainComponent, pathMatch: 'full'},
      { path: 'about', component: AboutComponent },
      { path: 'login', component: LoginComponent },
    ]
  },
] as Route[];