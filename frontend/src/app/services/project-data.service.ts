// Victoria Bogachenkova
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from 'app/classes/project';

import { RequestHandler } from 'app/classes/RequestHandler';
import { User } from 'app/classes/user';
import { ReroutingService } from './rerouting.service';
import { ToastCommService } from './toast-comm.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectDataService {
  private requestHandler: RequestHandler;
  private sessionToken: string | null;

  /**
   * Constructor instantiates requestHandler
   */
  constructor(private router: Router,
    private toastCommService: ToastCommService,
    private rerouter: ReroutingService) {
    this.sessionToken = sessionStorage.getItem('ses_token');
    this.requestHandler = new RequestHandler(this.sessionToken);
  }

  /**
   * Function which makes the request to the backend for all project of which the user is a member
   * Religates the parsing of the response to a different function. 
   * (uses requesthandler for communication with the backend)
   * 
   * @trigger on component creation
   * @modifies projects
   */
  async getProjects(): Promise<Array<Project>> {

    // Makes the backend request to get the projects of which the user is a member
    let response: any = await this.requestHandler.get("/project/home", {}, true);

    // Array with results
    let result: Array<Project> = new Array<Project>();

    // For each project in the list
    response.forEach((project: any) => {
      // Initialize a new project with all values
      let projectJson = project["project"];
      projectJson["numberOfArtifacts"] = project["projectNrArtifacts"];
      projectJson["numberOfCLArtifacts"] = project["projectNrCLArtifacts"];
      projectJson["users"] = project["projectUsers"];
      projectJson["admin"] = project["projectAdmin"];

      // Create the project with constructor
      let projectNew = new Project(projectJson["id"], projectJson["name"], projectJson["description"]);

      // Set other variables
      projectNew.setFrozen(projectJson["frozen"]);
      projectNew.setNumberOfArtifacts(projectJson["numberOfArtifacts"]);
      projectNew.setNumberOfCLArtifacts(projectJson["numberOfCLArtifacts"]);
      projectNew.setAdmin(projectJson["admin"]);
      projectNew.setUsers(projectJson["users"]);

      // Add project to list
      result.push(projectNew);
    });

    // Return result
    return result;
  }

  /**
   * Gets all the users in the application from the backend
   * 
   * @param token used for authenticating the user to the backend
   * 
   * @trigger on component load
   * @modifies allMembers
   */
  async getUsers(): Promise<Array<User>> {

    // Makes the request to the backend for all users in the application
    let response: any = await this.requestHandler.get("/project/users", {}, true);

    // Array with results
    let result: Array<User> = new Array<User>();

    // Loops over the response of the server and parses the response into the allMembers array
    for (let user of response) {
      // Creates the user object
      let newUser = new User(user.id, user.username);
      // Sets email of new user
      newUser.setEmail(user.email);
      // Sets the description of the new user
      newUser.setDesc(user.description);
      // pushes the new user to the array of all users
      result.push(newUser);
    }

    // Return result
    return result;

  }

  /**
   * Makes the project creation request to the backend
   * 
   * @param projectInformation Record holding the different parameters of the project to be created
   * @trigger Create project button is clicked
   */
  async makeRequest(projectInformation: Record<string, any>): Promise<void> {

    // Makes the backend request to get the projects of which the user is a member
    await this.requestHandler.post("/project/creation", projectInformation, true);
  }

  /**
   * Gets frozen status of the project from the backend
   * 
   * @trigger on calling of function
   */
  async getFrozen(): Promise<any> {
    try {
      //Getting frozen status from backend
      let result = await this.requestHandler.get("/project/settings", { 'p_id': this.rerouter.getProjectID(this.router.url) }, true);
      return result["frozen"];
    } catch {
      //If there is an error with getting the data
      this.toastCommService.emitChange([false, "An error occured when loading data from the server"]);
    }
  }


}
