import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { NavigationService } from '../_services/navigation.service';
import { GlobarvarService } from '../_services/globarvar.service';


@Component({
  selector: 'app-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  nav_opened: boolean = false;
  selectedPath = "/dashboard";
  panelOpenState: any = 0;
  expandedNavMenu: any = "";

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private navService: NavigationService,
    private globalvarService: GlobarvarService
  ) 
  { 
    
    this.selectedPath = localStorage.getItem('selectedPath') || this.selectedPath;
    if(localStorage.getItem("expandedNavMenu")){
      this.panelOpenState = 1;
    }
    this.navService.setNavActiveClass(window.location.pathname);
  }

  ngOnInit() {
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
