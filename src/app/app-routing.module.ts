import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { HomeComponent } from './user-layout/home/home.component';
import { DashboardComponent } from './admin-layout/dashboard/dashboard.component';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { LoginComponent } from './login/login.component';
import { AuthorizeGuard } from './authguard/authorize.guard';


export const appRoutes: Routes = [
  {
    path: '',  canActivate: [AuthorizeGuard], data: {ui: "frontend"}, component: UserLayoutComponent,
    children:[
      {path: '',component: HomeComponent},
      {path: 'home',component: HomeComponent},
    ]
  }, // end of frontend
  {
    path: 'dashboard',canActivate: [AuthorizeGuard], data: {ui: "backend"} ,component: AdminLayoutComponent,
    children:[ // relative parent path
      {path: '', component: DashboardComponent}, //default dashboard
      {path: 'dashboard', component: DashboardComponent},
      // { path: '**', redirectTo: "",pathMatch: "full"}, //--redirect to root path if invalid path found , This wildCard route always be at last
    ]
  }, //end of backend
  { path: 'login', component: LoginComponent},
  { path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
