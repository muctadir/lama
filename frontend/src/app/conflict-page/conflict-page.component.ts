import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/rerouting.service';

// Artifact object 
interface Artifact {
  conflictName: string,
  conflictDescription: string;
}

// Functions for adding values
function addValues(name:string, descr:string):Artifact {
  var conflictName = name;
  var conflictDescription = descr;
  // Return the given values
  return {conflictName, conflictDescription};
} 

@Component({
  selector: 'app-conflict-page',
  templateUrl: './conflict-page.component.html',
  styleUrls: ['./conflict-page.component.scss']
})
export class ConflictPageComponent {

  constructor(private router: Router) { }

  // Hardcoding some conflicts
  conflict1 = addValues("Artifact 1", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu venenatis nunc. Nam porttitor, tortor id blandit facilisis, tellus ex interdum nisl, nec molestie quam erat vitae lacus. Phasellus pulvinar risus a tortor congue fringilla. Aliquam malesuada nec velit vel sollicitudin. Nunc dictum ipsum nibh, ut convallis ipsum faucibus a. Aliquam auctor dictum mi, eget venenatis libero commodo quis. Etiam a molestie tortor.");
  conflict2 = addValues("Artifact 35", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu venenatis nunc. Nam porttitor, tortor id blandit facilisis, tellus ex interdum nisl, nec molestie quam erat vitae lacus. Phasellus pulvinar risus a tortor congue fringilla. Aliquam malesuada nec velit vel sollicitudin. Nunc dictum ipsum nibh, ut convallis ipsum faucibus a. Aliquam auctor dictum mi, eget venenatis libero commodo quis. Etiam a molestie tortor.");
  conflict3 = addValues("Artifact 104", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu venenatis nunc. Nam porttitor, tortor id blandit facilisis, tellus ex interdum nisl, nec molestie quam erat vitae lacus. Phasellus pulvinar risus a tortor congue fringilla. Aliquam malesuada nec velit vel sollicitudin. Nunc dictum ipsum nibh, ut convallis ipsum faucibus a. Aliquam auctor dictum mi, eget venenatis libero commodo quis. Etiam a molestie tortor.");
  // List of the projects
  conflicts: Artifact[] = [this.conflict1, this.conflict2, this.conflict3];


  /**
   * Gets the project id from the URL and reroutes to the conflict resolution page
   * of the same project
   * 
   * @trigger resolve conflict button is pressed
   */
   reRouter() : void {
    // Gets the url from the router
    let url: string = this.router.url
    
    // Initialize the ReroutingService
    let routeService: ReroutingService = new ReroutingService();
    // Use reroutingService to obtain the project ID
    let p_id = routeService.getProjectID(url);
    
    // Changes the route accordingly
    this.router.navigate(['/project', p_id, 'conflictResolution']);
  }

}
