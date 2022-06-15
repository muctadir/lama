// Victoria Bogachenkova
// Veerle Fürst
// Ana-Maria Olteniceanu
// Eduardo Costa Martins
// Jarl Jansen

import { Component, OnInit } from '@angular/core';
import { Project } from 'app/classes/project';
import { RequestHandler } from 'app/classes/RequestHandler';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LogoutComponent } from 'app/modals/logout/logout.component';
import { AccountInfoService } from 'app/services/account-info.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  /* Array with the projects that the user can view */
  projects: Project[] = [];

  /* Error message that is displayed to the user */
  errorMsg: string = "";

  /* Saves the user data */
  user: any;

  /**
   * Initializes the modal service provided by bootstrap
   * 
   * @param modalService instance of modal
   * @trigger on loads
   */
  constructor(private modalService: NgbModal, private accountService: AccountInfoService) {}

  /**
   * When the component gets created calls function to gather all the projects that the user is a member of
   * 
   * @trigger on component creation
   * @modifies projects
   */
  async ngOnInit(): Promise<void> {
    // Makes the request to the backend for the projects
    await this.makeRequest();
    // Makes the request to the backend to get the user data
    this.user = await this.accountService.userData();
  }

  /**
   * Function which makes the request to the backend for all project of which the user is a member
   * Religates the parsing of the response to a different function. 
   * (uses requesthandler for communication with the backend)
   * 
   * @trigger on component creation
   * @modifies projects
   */
  async makeRequest() : Promise<void> {
    // Get the user authentication token
    let token: string | null  = sessionStorage.getItem('ses_token');

    // Initializes the request handler
    let requestHandler: RequestHandler = new RequestHandler(token);

    try {
      // Makes the backend request to get the projects of which the user is a member
      let response: any = requestHandler.get("/project/home", {}, true);

      // Waits on the request
      let result = await response;

      // Parses the response of the backend with all projects
      this.parseResponse(result)

      // Resets error message
      this.errorMsg = "";
    } catch(e) {
      // Displays error message
      this.errorMsg = "An error occured when getting data from the server.";
    }
  }

  /**
   * Parses the response from the backend and adds the projects into project array
   * 
   * @param data the response from the backend
   * @modifies project
   * @trigger on component load
   */
  parseResponse(data: any) : void {
    // For each project in the list
    for (let project of data) {
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
      this.projects.push(projectNew);
    }
  }

  /**
   * Opens the logout modal asking confirmation for logging out
   * 
   * @trigger click on logout button
   */
  openLogout() : void {
    // opens logout modal
    this.modalService.open(LogoutComponent, {});
  }

}