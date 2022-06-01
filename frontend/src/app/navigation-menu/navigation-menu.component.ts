import { Component, OnDestroy } from '@angular/core';
import { NavCollapseService } from '../nav-collapse.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss']
})
export class NavigationMenuComponent implements OnDestroy {

  /* Indicates whether the navigation menu is collapsed or not */
  collapsed = true;
  /* Holds the link with the BehaviourSubject, which is used to communicate with the project component */
  subscription: Subscription;

  /* Indicates what page the user is currently viewing. */
  page = 0;

  /**
   * Ensures that page holds the value of the current page, and subscribes to the BehaviourSubject
   * 
   * @param commService instance of NavCollapseService used to communicate with project component
   */
  constructor(private router: Router, private commService: NavCollapseService) {
    this.route_det_page();
    this.subscription = this.commService.currentCollapsed.subscribe(msg => this.collapsed = msg);
  }

  /**
   * Destroys the BehaviourSubject used to communicate between the navigation menu and the project component
   * 
   * @trigger when component gets destroyed
   * @modifies subscription
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Changes the navigation menu from collapsed to non-collapsed, and the other way around.
   * 
   * @trigger when the top most icon is clicked in the navigation menu
   * @modifies collapsed
   */
  changeSize() {
    this.commService.modifyCollapsed(this.collapsed);
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
