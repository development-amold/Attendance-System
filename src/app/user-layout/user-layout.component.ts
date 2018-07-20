import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { NavigationService } from '../_services/navigation.service';
import { GlobarvarService } from '../_services/globarvar.service';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.css']
})
export class UserLayoutComponent implements OnInit {
  nav_opened: boolean = false;
  selectedPath = "/home";
  panelOpenState: any = 0;
  expandedNavMenu: any = "";

  current_user: any;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private navService: NavigationService,
    private globalvarService: GlobarvarService    
  ) { 
      this.selectedPath = localStorage.getItem('selectedPath') || this.selectedPath;
      if(localStorage.getItem("expandedNavMenu")){
        this.panelOpenState = 1;
      }
      this.navService.setNavActiveClass(window.location.pathname);    
  }

  ngOnInit() {
    this.current_user = this.authService.getUserDetails();
  }

  navigateLink(linkpath){
    this.navService.setNavActiveClass(linkpath);
    this.selectedPath = localStorage.getItem('selectedPath') || this.selectedPath;
    this.router.navigate([linkpath]);
  }

  logout(): void{
    this.authService.logout();
    this.router.navigate(["/login"]);
  }  


}
