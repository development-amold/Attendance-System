import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { HomeComponent } from './user-layout/home/home.component';
import { DashboardComponent } from './admin-layout/dashboard/dashboard.component';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { LoginComponent } from './login/login.component';
import { AuthorizeGuard } from './authguard/authorize.guard';
import { UsersListComponent } from './views/users/users-list/users-list.component';
import { UsersAddComponent } from './views/users/users-add/users-add.component';
import { UsersEditComponent } from './views/users/users-edit/users-edit.component';
import { AttendanceAddComponent } from './views/users-attendance/attendance-add/attendance-add.component';
import { AttendanceListComponent } from './views/users-attendance/attendance-list/attendance-list.component';
import { AttendanceEditComponent } from './views/users-attendance/attendance-edit/attendance-edit.component';
import { AttendanceShowComponent } from './views/users-attendance/attendance-show/attendance-show.component';


export const appRoutes: Routes = [
  {
    path: '',  canActivate: [AuthorizeGuard], data: {ui: "frontend"}, component: UserLayoutComponent,
    children:[
      {path: '',component: HomeComponent},
      {path: 'home',component: HomeComponent},
      {path: 'attendance', component: AttendanceListComponent},
      {path: 'attendance/new', component: AttendanceAddComponent},
      {path: 'attendance/:id/edit', component: AttendanceEditComponent},
      {path: 'attendance/:id', component: AttendanceShowComponent}
    ]
  }, // end of frontend
  {
    path: 'dashboard',canActivate: [AuthorizeGuard], data: {ui: "backend"} ,component: AdminLayoutComponent,
    children:[ // relative parent path
      {path: '', component: DashboardComponent}, //default dashboard
      {path: 'employees', component: UsersListComponent},
      {path: 'employees/new', component: UsersAddComponent},
      {path: 'employees/edit/:id', component: UsersEditComponent},
      {path: 'attendance', component: AttendanceListComponent},
      {path: 'attendance/new', component: AttendanceAddComponent},
      {path: 'attendance/:id/edit', component: AttendanceEditComponent},
      {path: 'attendance/:id', component: AttendanceShowComponent}
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
