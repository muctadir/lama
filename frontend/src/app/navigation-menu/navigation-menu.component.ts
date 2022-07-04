/* @author Jarl */
import { Component, HostBinding } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ReroutingService } from 'app/services/rerouting.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from 'app/modals/confirm-modal/confirm-modal.component';
import { ToastCommService } from 'app/services/toast-comm.service';

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
   * Also creates instance of NgbModal, ReroutingService, ToastCommService
   * 
   * @param router Instance of the Router class used to get info about the current route
   * @param modalService Instance of the NgbModal 
   * @param routeService instance of ReroutingService
   * @param toastCommService instance of ToastCommService
   * 
   * @trigger when the route changes
   */
  constructor(private router: Router, 
    private toastCommService: ToastCommService, 
    private modalService: NgbModal,
    private routeService: ReroutingService) {
  }

  /**
   * Ensures that the correct icon is highlighted
   * 
   * @trigger on component creation, and when route is changed
   */
  ngOnInit() : void {
    // Ensures that the currently highlighted icon is correct
    this.evalURL(this.router.url);

    // Subscribes to the router event
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        // code executed when the route changes 
        let new_route = ev['urlAfterRedirects'];
        this.evalURL(new_route);
      }
    });
  }

  /**
   * Uses the new_route to determine what icon should be coloured.
   * 
   * @param new_route the url
   * @modifies page
   */
  evalURL(new_route: string) : void {
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
    } else if (new_route.includes("settings")) {
      // highlights settings page icon
      this.page =6;
    }
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
    // Use reroutingService to obtain the project ID
    let p_id = this.routeService.getProjectID(this.router.url);
    
    // Changes the route to the requested page
    this.router.navigate(['/project', p_id, next_page]);
  }

  /**
   * Opens the confirm modal and listen for confirm event to be emitted
   * 
   * @trigger logout button clicked
   */
  openLogout() : void {
    // Opens logout modal
    let modalRef = this.modalService.open(ConfirmModalComponent, {});

    // Listens for an event emitted by the modal
    modalRef.componentInstance.confirmEvent.subscribe(async ($e: boolean) => {
      // If a confirmEvent = true is emitted we delete the user
      if($e) {
        // Drops the session token
        sessionStorage.removeItem('ses_token');

        // Navigates to the login page
        this.router.navigate(['/login'])

        // Logged out popup
        this.toastCommService.emitChange([true, "Logged out successfully"]);
      }
    })
  }
}