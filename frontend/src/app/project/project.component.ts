import { Component, OnDestroy } from '@angular/core';
import { NavCollapseService } from '../nav-collapse.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnDestroy {
  collapsed = true;
  subscription: Subscription;

  constructor(private appService: NavCollapseService) { 
    this.subscription = this.appService.currentCollapsed.subscribe(message => this.collapsed = message);
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
