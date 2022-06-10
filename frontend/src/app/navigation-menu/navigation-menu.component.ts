/* @author Jarl */
import { Component, HostBinding } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ReroutingService } from 'app/rerouting.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LogoutComponent } from 'app/logout/logout.component';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss']
})
export class NavigationMenuComponent {
  /**
   * Changes the sizing of the navigation component 
   * based on whether the menu should be collapsed or not
   */
  @HostBinding('style.width') get className() { 
    // if the navigation bar is collapsed set size to col-1
    if (this.collapsed) {
      return '8.3333333333%';
    } 
    // if the navigation bar is not collapsed set size to col-3
    else {
      return '25%';
    }
  }

  /* Indicates whether the navigation bar should be expanded or collapsed. */
  collapsed = true;

  /* Indicates the what icon in the navigation bar should be highlighted. */
  page = 0;

  /**
   * Subscribes to the router events, when the routing changes updates the icon highlighted
   * in the navigation bar accordingly
   * 
   * Also creates instance of NgbModal
   * 
   * @param router Instance of the Router class used to get info about the current route
   * @param modalService Instance of the NgbModal 
   * 
   * @trigger when the route changes
   * @modifies page 
   */
  constructor(private router: Router, private modalService: NgbModal) {
    // subscribes to the router event
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        // code executed when the route changes 
        let new_route = ev['urlAfterRedirects'];
        if (new_route.includes("stats")) {
          // highlights stats page icon
          this.page = 0;
        } else if (new_route.includes("labelling")) {
          // highlights labelling page icon
          this.page = 1;
        } else if (new_route.includes("artifact")) {
          // highlights artifact management page icon
          this.page = 2;
        } else if (new_route.includes("label")) {
          // highlights labelling management page icon
          this.page = 3;
        } else if (new_route.includes("theme")) {
          // highlights theme management page icon
          this.page = 4;
        } else if (new_route.includes("conflict")) {
          // highlights conflict management page icon
          this.page = 5;
        }
      }
    });
  }

  /**
   * Changes the navigation menu from collapsed to non-collapsed, and the other way around.
   * 
   * @trigger when the top most icon is clicked in the navigation menu
   * @modifies collapsed
   */
  changeSize() : void {
    this.collapsed = !this.collapsed;
  }

  /**
   * Changes the page to the page that the user wants to view.
   * 
   * @param next_page new page the user wants to see
   * @trigger onclick nav menu
   */
  changePage(next_page : string) : void  {
    // Removes the first character from the route
    let url : string = this.router.url;

    // Initialize the ReroutingService
    let routeService: ReroutingService = new ReroutingService();
    // Use reroutingService to obtain the project ID
    let p_id = routeService.getProjectID(url);
    
    // Changes the route accordingly
    this.router.navigate(['/project', p_id, next_page]);
  }

  /**
   * Opens the logout modal
   * 
   * @trigger logout button clicked
   */
  openLogout() : void {
    this.modalService.open(LogoutComponent, {});
  }

}
