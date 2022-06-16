import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/services/rerouting.service';
import { ConflictDataService } from 'app/services/conflict-data.service';

@Component({
  selector: 'app-conflict-page',
  templateUrl: './conflict-page.component.html',
  styleUrls: ['./conflict-page.component.scss']
})
export class ConflictPageComponent implements OnInit {

  constructor(private router: Router,
     private reroutingService: ReroutingService,
     private conflictDataService: ConflictDataService) { }

  /**
   * Gets all the users within the application from the backend
   * Stores the users in the allMembers array
   * Gets project information from the backend
   * Store the project in currentProject
   * 
   * @modifies allMembers, currentProject
   * @trigger on creation of component
   */
   ngOnInit(): void {
    // Initiliazing project with the retrieved project ID from URL
    let projectID = +(this.reroutingService.getProjectID(this.router.url));

    // Get the conflicts from the backend
    this.requestConflicts(projectID);
  }

  // List of the conflicts
  conflicts: any[] = [];

  /**
   * Gets the project id from the URL and reroutes to the conflict resolution page
   * of the same project
   * 
   * @trigger resolve conflict button is pressed
   */
   reRouter(a_id: number, lt_id: number, lt: string) : void {
    // Gets the url from the router
    let url: string = this.router.url
    // Initialize the ReroutingService
    let routeService: ReroutingService = new ReroutingService();
    // Use reroutingService to obtain the project ID
    let p_id = routeService.getProjectID(url);
    // Changes the route accordingly
    this.router.navigate(['/project', p_id, 'conflictResolution', a_id, lt_id, lt ]);
  }

  /**
   * Gets all the users in the application from the backend
   * 
   * @param token used for authenticating the user to the backend
   * 
   * @trigger on component load
   * @modifies allMembers
   */
   async requestConflicts(p_id: number) : Promise<void> {
    const conflicts = await this.conflictDataService.getConflicts(p_id)
    this.conflicts = conflicts
  }
}
