import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavCollapseService } from '../nav-collapse.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss']
})
export class NavigationMenuComponent implements OnDestroy {

  collapsed = true;
  subscription: Subscription;

  constructor(route: ActivatedRoute, private data: NavCollapseService) {
    route.params.subscribe(params => console.log("side menu id parameter",params['id']));
    this.subscription = this.data.currentCollapsed.subscribe(msg => this.collapsed = msg)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  changeSize() {
    this.data.modifyCollapsed(this.collapsed);
  }

  tester() {
    console.log(this.collapsed);
  }
}
