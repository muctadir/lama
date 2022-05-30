import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NavCollapseService } from '../nav-collapse.service';
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
   * @param router instance of router used to get the current url
   * @param commService instance of NavCollapseService used to communicate with project component
   */
  constructor(private router: Router, private commService: NavCollapseService) {
    this.det_page();
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
   * Determines what page the user is on based on the url
   * 
   * @trigger whenever the component is opened, or when user routes to new page in project
   * @modifies page
   * 
   * TODO: Add the conditional statements for all the other paths
   */
  det_page() {
    let route = this.router.url;
    if (route.includes("stats")) {
      this.page = 0;
    } else {
      this.page = 1;
    }
  }

}
