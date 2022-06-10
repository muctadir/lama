import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/services/rerouting.service';

type user = {
  username: string,
  nr_labelled: number,
  time: number,
  nr_themes: number,
  nr_conflicts: number
}

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent {

  // Pagination Settings
  page = 1;
  pageSize = 10;

  /**
   * Initializes the router 
   * 
   * @param router instance of router
   */
  constructor(private router: Router) { }

  // Dummy data
  user_contribution: Array<user> = [
    {
      username: "Harry",
      nr_labelled: 5,
      time: 20,
      nr_themes: 4,
      nr_conflicts: 2
    },
    {
      username: "Barry",
      nr_labelled: 1,
      time: 42,
      nr_themes: 2,
      nr_conflicts: 1
    },
    {
      username: "Warry",
      nr_labelled: 2,
      time: 21,
      nr_themes: 1,
      nr_conflicts: 2
    },
    {
      username: "Sarry",
      nr_labelled: 0,
      time: 0,
      nr_themes: 0,
      nr_conflicts: 0
    },
    
  ]

  /**
   * Gets the project id from the URL and reroutes to the labelling page
   * of the same project
   * 
   * @trigger start labelling button is pressed
   */
  reRouter() : void {
    // Gets the url from the router
    let url: string = this.router.url
    
    // Initialize the ReroutingService
    let routeService: ReroutingService = new ReroutingService();
    // Use reroutingService to obtain the project ID
    let p_id = routeService.getProjectID(url);
    
    // Changes the route accordingly
    this.router.navigate(['/project', p_id, 'labelling-page']);
  }
}
