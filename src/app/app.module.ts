import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import {CommonHttpInterceptor} from './interceptor/common-http-interceptor';

// For toastr notifications
import { ToastrModule } from 'ngx-toastr';

//angular material
import { 
  // CdkTreeModule,
  MatAutocompleteModule,
  // MatBadgeModule,
  // MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatStepperModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  // MatTreeModule,  
} from '@angular/material';

import {CdkTableModule} from '@angular/cdk/table';

import { Globalvar } from './_shared/globals';
import { UsersAddComponent } from './views/users/users-add/users-add.component';
import { UsersEditComponent } from './views/users/users-edit/users-edit.component';
import { UsersListComponent } from './views/users/users-list/users-list.component';
import { AttendanceAddComponent } from './views/users-attendance/attendance-add/attendance-add.component';
import { AttendanceEditComponent } from './views/users-attendance/attendance-edit/attendance-edit.component';
import { AttendanceListComponent } from './views/users-attendance/attendance-list/attendance-list.component';
import { UserService } from './_services/user.service';


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
    LoginComponent,
    UsersAddComponent,
    UsersEditComponent,
    UsersListComponent,
    AttendanceAddComponent,
    AttendanceEditComponent,
    AttendanceListComponent
  ],
  imports: [
    BrowserModule, 
    AppRoutingModule, 
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CdkTableModule,
    // CdkTreeModule,
    MatAutocompleteModule,
    // MatBadgeModule,
    // MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    // MatTreeModule,
    ToastrModule.forRoot({ // toastr global settings
      positionClass: 'toast-top-center',
      preventDuplicates: true,  
      closeButton: true    
    }),
  ],
  exports:[
    CdkTableModule,
    // CdkTreeModule,
    MatAutocompleteModule,
    // MatBadgeModule,
    // MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    // MatTreeModule    
  ],
  providers: [
    AuthenticationService, 
    AuthorizeGuard, 
    ButtonService, 
    HomeService, 
    Globalvar,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CommonHttpInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
