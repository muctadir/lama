import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss']
})
export class NavigationMenuComponent {

  constructor(route: ActivatedRoute) {
    route.params.subscribe(params => console.log("side menu id parameter",params['id']));
  }

}
