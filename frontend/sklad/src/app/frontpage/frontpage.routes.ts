import { Route, RouterModule, Routes } from "@angular/router";
import { FrontpageComponent } from "./frontpage.component";
import { MainComponent } from "./main/main.component";
import { NgModule } from "@angular/core";

// export const frontpageRoutes: Routes = [
export default [
  { 
    path: '', 
    component: FrontpageComponent,
    children: [
      { path: '', component: MainComponent, pathMatch: 'full' },
    ]
  },
] as Route[];

// @NgModule({
//   imports: [RouterModule.forRoot(frontpageRoutes/*, {preloadingStrategy: PreloadAllModules}*/)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule {}
