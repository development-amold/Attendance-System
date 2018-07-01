import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { HomeComponent } from './user-layout/home/home.component';
import { DashboardComponent } from './admin-layout/dashboard/dashboard.component';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { LoginComponent } from './login/login.component';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent},
  {
    path: '', component: UserLayoutComponent,
    children:[
      {path: '',redirectTo: "home", pathMatch: "full"},
      {path: 'home',component: HomeComponent},
    ]
  }, // end of frontend
  {
    path: 'admin', component: AdminLayoutComponent,
    children:[ // relative parent path
      {path: '', redirectTo: "dashboard",pathMatch: "full"},
      {path: 'dashboard', component: DashboardComponent},
      // { path: '**', component: PageNotFoundComponent},
      // { path: '**', redirectTo: "",pathMatch: "full"}, //--redirect to root path if invalid path found , This wildCard route always be at last
    ]
  }, //end of backend
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
