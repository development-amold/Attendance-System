import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './admin-layout/dashboard/dashboard.component';

export const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {
    path: 'admin', component: AdminLayoutComponent,
    children:[ // relative parent path
      {path: '', redirectTo: "dashboard",pathMatch: "full"},
      {path: 'dashboard', component: DashboardComponent},
      { path: '**', component: PageNotFoundComponent},
      // { path: '**', redirectTo: "",pathMatch: "full"}, //--redirect to root path if invalid path found , This wildCard route always be at last
    ]
  },
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