import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';


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
import { LoginComponent } from './login/login.component';
import { AuthenticationService } from './_services/authentication.service';
import { HomeService } from './_services/home.service';
import { ButtonService } from './_services/button.service';
import { AuthorizeGuard } from './authguard/authorize.guard';

// For toastr notifications
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Globalvar } from './_shared/globals';  //maintain global data

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
    UserHeaderComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule, 
    AppRoutingModule, 
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({ // toastr global settings
      positionClass: 'toast-top-center',
      preventDuplicates: true,  
      closeButton: true    
    }),
  ],
  providers: [AuthenticationService, AuthorizeGuard, ButtonService, HomeService, Globalvar],
  bootstrap: [AppComponent]
})
export class AppModule { }
