import { Injectable } from '@angular/core';

@Injectable()
export class NavigationService {
  panelOpenState: any = 0;
  constructor() { }

  setNavActiveClass(linkpath){
    localStorage.setItem('selectedPath', linkpath);
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

}
