import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/services/rerouting.service';
import { RequestHandler } from 'app/classes/RequestHandler';

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
export class ConflictPageComponent implements OnInit {

  constructor(private router: Router) { }

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
    //Initiliazing project with the retrieved project ID from URL
    let projectID = +(this.reroutingService.getProjectID(this.router.url));

    // Gets the authentication token from the session storage
    let token: string | null  = sessionStorage.getItem('ses_token');

    if (typeof token === "string") {
      // Get all users within the tool
      this.requestConflicts(token);
    }
  }

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

  /**
   * Gets all the users in the application from the backend
   * 
   * @param token used for authenticating the user to the backend
   * 
   * @trigger on component load
   * @modifies allMembers
   */
   async requestConflicts(token : string | null) : Promise<void> {
    // Initializes the request handler
    let requestHandler: RequestHandler = new RequestHandler(token);

    // Makes the request and handles response
    try {
      // Makes the request to the backend for all users in the application
      let response: any = requestHandler.get("/conflict/home", {}, true);

      // Waits on the request
      let result = await response;

      console.log(result)

      // // Loops over the response of the server and parses the response into the allMembers array
      // for (let user of result) {
      //   // creates the object
      //   let newUser = new User(user.id, user.username);
      //   // passes additional data to the newly created user object
      //   newUser.setEmail(user.email);
      //   newUser.setDesc(user.description);
      //   // pushes the new user to the array of all users
      //   this.allMembers.push(newUser);
      // }
    } catch(e) {
      // Outputs an error
      console.log("An error occured when loading data from the server");
    }
  }
}
