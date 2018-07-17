import { Injectable } from '@angular/core';

@Injectable()
export class GlobarvarService {
  nav_opened: boolean = false;
  selectedPath = localStorage.getItem('selectedPath') || "/dashboard"
  panelOpenState: any = 0;
  expandedNavMenu: any = "";

  constructor() { }

  formatDate(date) {
    var monthNames = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul",
      "Aug", "Sep", "Oct",
      "Nov", "Dec"
    ];
  
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
  
    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  }

}
