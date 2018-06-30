import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { FooterComponent } from './admin-layout/footer/footer.component';
import { HeaderComponent } from './admin-layout/header/header.component'; 
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './user-layout/home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './admin-layout/dashboard/dashboard.component';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { UserFooterComponent } from './user-layout/user-footer/user-footer.component';
import { UserHeaderComponent } from './user-layout/user-header/user-header.component';


@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    HeaderComponent,
    FooterComponent,
    PageNotFoundComponent,
    HomeComponent,
    DashboardComponent,
    UserLayoutComponent,
    UserFooterComponent,
    UserHeaderComponent
  ],
  imports: [
    BrowserModule, AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
