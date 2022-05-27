import { Component, OnDestroy } from '@angular/core';
import { NavCollapseService } from '../nav-collapse.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnDestroy {

  /* Indicates whether the navigation menu is collapsed or not */
  collapsed = true;
  /* Holds the link with the BehaviourSubject, which is used to communicate with the nav-menu component */
  subscription: Subscription;

  /**
   * Subscribes to the BehaviourSubject
   * 
   * @param commService instance of NavCollapseService used to communicate with nav-menu component
   */
  constructor(private commService: NavCollapseService) { 
    this.subscription = this.commService.currentCollapsed.subscribe(message => this.collapsed = message);
  }
  
  /**
   * Destroys the BehaviourSubject used to communicate between the navigation menu and the project component
   * 
   * @trigger when component gets destroyed
   * @modifies subscription
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
