import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) { 
    this.selectedPath = localStorage.getItem('selectedPath') || this.selectedPath;
    if(localStorage.getItem("expandedNavMenu")){
      this.panelOpenState = 1;
    }
    this.setNavActiveClass(window.location.pathname);
  }

  ngOnInit() {
  }

  setNavActiveClass(linkpath){
    localStorage.setItem('selectedPath', linkpath);
    this.selectedPath = linkpath;
    switch(linkpath){
      case "/dashboard/employees/new":
      localStorage.setItem("expandedNavMenu", "employees");
      break;
      case "/dashboard/employees":
      localStorage.setItem("expandedNavMenu", "employees");
      break;      
      default:
      this.panelOpenState = 0;
      localStorage.removeItem("expandedNavMenu");
    }    
  }

  navigateLink(linkpath){
    this.setNavActiveClass(linkpath);
    this.router.navigate([linkpath]);
  }

}
