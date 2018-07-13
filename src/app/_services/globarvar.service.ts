import { Injectable } from '@angular/core';

@Injectable()
export class GlobarvarService {
  nav_opened: boolean = false;
  selectedPath = localStorage.getItem('selectedPath') || "/dashboard"
  panelOpenState: any = 0;
  expandedNavMenu: any = "";

  constructor() { }

}
