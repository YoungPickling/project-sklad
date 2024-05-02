import { Route } from "@angular/router";
import { FrontpageComponent } from "./frontpage.component";
import { MainComponent } from "./main/main.component";
import { AboutComponent } from "./about/about.component";
import { LoginComponent } from "./login/login.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { ProfileComponent } from "./profile/profile.component";

// export const frontpageRoutes: Routes = [
export default [
  {
    path: '',
    component: FrontpageComponent,
    children: [
      { path: '', component: MainComponent, pathMatch: 'full'},
      { path: 'about', component: AboutComponent },
      { path: 'login', component: LoginComponent },
      { path: 'profile', component: ProfileComponent },
      { path: '**', component: NotFoundComponent },
    ]
  },
] as Route[];