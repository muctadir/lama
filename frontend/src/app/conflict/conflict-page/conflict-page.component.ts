// Ana-Maria Olteniceanu
// Linh Nguyen
// Veerle Fürst
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/services/rerouting.service';
import { ConflictDataService } from 'app/services/conflict-data.service';
import { ToastCommService } from 'app/services/toast-comm.service';

@Component({
  selector: 'app-conflict-page',
  templateUrl: './conflict-page.component.html',
  styleUrls: ['./conflict-page.component.scss']
})
export class ConflictPageComponent implements OnInit {
  // List of the conflicts
  conflicts: any[] = [];

  /**
   * Initializes the router, rerouting service and conflict data service
   * @param router instance of router
   * @param reroutingService instance of rerouting service
   * @param conflictDataService instance of ConflictDataService
   * @param toastCommService instance of ToastCommService
   */
  constructor(private router: Router,
    private reroutingService: ReroutingService,
    private conflictDataService: ConflictDataService,
    private toastCommService: ToastCommService) { }

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

  /**
   * Gets the project id from the URL and reroutes to the conflict resolution page
   * of the same project
   * 
   * @trigger resolve conflict button is pressed
   */
  reRouter(a_id: number, lt_id: number, lt: string): void {
    // Gets the url from the router
    let url: string = this.router.url
    // Use reroutingService to obtain the project ID
    let p_id = this.reroutingService.getProjectID(url);
    // Changes the route accordingly
    this.router.navigate(['/project', p_id, 'conflictResolution', a_id, lt_id, lt]);
  }

  /**
   * Gets all the users in the application from the backend
   * 
   * @param token used for authenticating the user to the backend
   * 
   * @trigger on component load
   * @modifies allMembers
   */
  async requestConflicts(p_id: number): Promise<void> {
    //Getting conflict data from service
    const conflicts = await this.conflictDataService.getConflicts(p_id)
    //Setting the conflict data to the variable
    if (conflicts.length == 0) {
      this.toastCommService.emitChange([true, "There are no conflicts"]);
      this.router.navigate(['/project', p_id, 'stats'])
    }
    this.conflicts = conflicts
  }
}
