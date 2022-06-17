import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ArtifactDataService } from 'app/services/artifact-data.service';
import { LabellingDataService } from 'app/services/labelling-data.service';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/services/rerouting.service';
import { StringArtifact } from 'app/classes/stringartifact';
import { LabelType } from 'app/classes/label-type';

@Component({
  selector: 'app-single-artifact-view',
  templateUrl: './single-artifact-view.component.html',
  styleUrls: ['./single-artifact-view.component.scss']
})
export class SingleArtifactViewComponent implements OnInit {

  // Initialize the ReroutingService
  routeService: ReroutingService;
  // Initialize the artifact
  artifact: StringArtifact;
  // Initialize list of users
  users: Array<any>
  // Initialize array of label types in the project
  labelTypes: Array<LabelType>;
  // Initialize the url
  url: string;
  // Initialize record of labels given per label type + remarks
  userLabels: Record<string, Record<string, any>>;

  // Initialize boolean value that represents whether the current user is admin
  admin: boolean;
  // Initialize the username of the current user
  username: string;

  /**
     * Constructor passes in the modal service and the artifact service,
     * initializes Router
     * @param modalService instance of NgbModal
     * @param artifactDataService instance of ArtifactDataService
     * @param router instance of Router
     */
  constructor(private modalService: NgbModal,
    private artifactDataService: ArtifactDataService,
    private labellingDataService: LabellingDataService,
    private router: Router) {
    //Initializing variables
    this.routeService = new ReroutingService();
    this.artifact = new StringArtifact(0, 'null', 'null');
    this.users = [];
    this.labelTypes = new Array<LabelType>();
    this.url = this.router.url;
    this.userLabels = {};
    this.admin = false;
    this.username = '';
  }

  /**
   * Gets the artifact id, project ID and the artifact from the backend
   * Stores the users in the allMembers array
   * Gets project information from the backend
   * Store the project in currentProject
   *
   * @modifies allMembers, currentProject
   * @trigger on creation of component
   */
  async ngOnInit(): Promise<void> {
    // Get the ID of the artifact and the project
    let a_id = Number(this.routeService.getArtifactID(this.url));
    let p_id = Number(this.routeService.getProjectID(this.url));

    // Get the artifact data from the backend
    this.getArtifact(a_id, p_id)
    // Get the label types with their labels
    await this.getLabelTypesWithLabels(p_id)
  }

   /**
   * Sets a specific artifacts and its necessary data from artifact-data.service
   * 
   * @param a_id the id of the artifact
   * @param p_id the id of the project
   */
  async getArtifact(a_id: number, p_id: number): Promise<void> {
    const result = await this.artifactDataService.getArtifact(p_id, a_id);
    this.artifact = result["result"];
    this.userLabels = result["labellings"];
    this.username = result["username"];
    this.admin = result["admin"];
    this.users = result["users"];
  }

  /**
   * Function for getting the label and labeltypes
   * @param p_id
   */
   async getLabelTypesWithLabels(p_id: number): Promise<void> {
    // Try to get the label type and labels
    try {
      // Make call to the backend
      const labelTypes =
        await this.labellingDataService.getLabelTypesWithLabels(p_id);
      // Set the list of label types
      this.labelTypes = labelTypes;
    // If an error is caught, redirect user to the project's homepage
    } catch {
      this.router.navigate(['/project', p_id]);
    }
  }

}