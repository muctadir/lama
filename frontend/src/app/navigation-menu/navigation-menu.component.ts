import { Component, OnDestroy, HostBinding, } from '@angular/core';
import { NavCollapseService } from '../nav-collapse.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss']
})
export class NavigationMenuComponent {
  @HostBinding('style.width') get className() { 
    if (this.collapsed) {
      return '8.3333333333%';
    } else {
      return '25%';
    }
  }

  tester() {
    this.collapsed = !this.collapsed;
  }

  collapsed = true;

  page = 0;



  /**
   * Ensures that page holds the value of the current page, and subscribes to the BehaviourSubject
   * 
   * @param commService instance of NavCollapseService used to communicate with project component
   */
  constructor(private router: Router) {
    this.route_det_page();
  }


  /**
   * Changes the navigation menu from collapsed to non-collapsed, and the other way around.
   * 
   * @trigger when the top most icon is clicked in the navigation menu
   * @modifies collapsed
   */
  changeSize() {
    this.collapsed = !this.collapsed;
  }




  
  /**
   * Determines what page the user is on
   * 
   * @param navnr the page to which the user is navigating
   * 
   * @trigger whenever the component is opened, or when user routes to new page in project
   * @modifies page
   */
  det_page(navnr: number) {
    this.page = navnr;
    if (this.page == 0) {
      this.router.navigate(['/project/stats']);
    } 
    else if (this.page == 1) {
      this.router.navigate(['/project/labelling-page']);
    }
    else if (this.page == 2) {
      this.router.navigate(['/project/artifactmanagement']);
    }
    else if (this.page == 3) {
      this.router.navigate(['/project/labelmanagement']);
    }
    else if (this.page == 4) {
      this.router.navigate(['/project/thememanagement']);
    }
    else if (this.page == 5) {
      this.router.navigate(['/project/conflict']);
    }
  }

  /**
   * Determines the page that shown be shown based on the current route
   * 
   * @trigger when a navigation-menu is initialized
   */
  route_det_page() {
    let route = this.router.url;
    // if the route contains stats page, should highlight icon 0
    if (route.includes("stats")){
      this.page = 0;
    } 
    // if the route contains labelling page, should highlight icon 1
    if (route.includes("labelling")){
      this.page = 1;
    }
    // if the route contains artifact management page, should highlight icon 2
    if (route.includes("artifact")){
      this.page = 2;
    }
    // if the route contains label management page, should highlight icon 2
    if (route.includes("labelmanagement")){
      this.page = 3;
    }
    // if the route contains theme management page, should highlight icon 2
    if (route.includes("theme")){
      this.page = 4;
    }
    // if the route contains conflict page, should highlight icon 2
    if (route.includes("conflict")){
      this.page = 5;
    }
  }

}
