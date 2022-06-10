import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ArtifactDataService } from 'app/services/artifact-data.service';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/services/rerouting.service';
import { StringArtifact } from 'app/classes/stringartifact';

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
  // Will be changed once the route to get labels by label types is merged 
  allLabels: Array<string> = ['Fakeroonie', ' Truth']
  // Initialize the url
  url: string;
  // Initialize list of labels given + remarks per user
  userLabels: Array<any> = []

  // Will be changed once @inproject decorator is merged
  admin: boolean;
  // Initialize the username of the current user
  username: string;


  notImplemented() {
    alert("This button is not implemented.");
  }

  /**
     * Constructor passes in the modal service and the artifact service,
     * initializes Router
     * @param modalService instance of NgbModal
     * @param artifactDataService instance of ArtifactDataService
     * @param router instance of Router
     */
  constructor(private modalService: NgbModal,
    private artifactDataService: ArtifactDataService,
    private router: Router) {
    this.routeService = new ReroutingService();
    this.artifact = new StringArtifact(0, 'null', 'null');
    this.url = this.router.url;
    this.admin = false;
    this.username = '';
  }

  ngOnInit(): void {
    // Get the ID of the artifact and the project
    let a_id = Number(this.routeService.getArtifactID(this.url));
    let p_id = Number(this.routeService.getProjectID(this.url));

    // Get the artifact data from the backend
    this.getArtifact(a_id, p_id)
  }

   /**
   * Sets a specific artifacts and its necessary data from artifact-data.service
   * 
   * @param a_id the id of the artifact
   * @param p_id the id of the project
   */
  async getArtifact(a_id: number, p_id: number): Promise<void> {
    const result = await this.artifactDataService.getArtifact(p_id, a_id);
    this.artifact = result[0];
    this.userLabels = result[1];
    this.username = result[2];
  }
}