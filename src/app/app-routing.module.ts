import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: 'login', loadChildren: () => import('./components/login/login.module').then(module => module.LoginModule) },
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(module => module.DashboardModule) },
  { path: "**", redirectTo: "dashboard" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
