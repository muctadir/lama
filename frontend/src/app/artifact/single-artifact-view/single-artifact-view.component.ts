import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ArtifactDataService } from 'app/services/artifact-data.service';
import { LabellingDataService } from 'app/services/labeling-data.service';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/services/rerouting.service';
import { StringArtifact } from 'app/classes/stringartifact';
import { Label } from 'app/classes/label';
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
  // Initialize array of label types in the project
  labelTypes: Array<LabelType>;
  // Initialize the url
  url: string;
  // Initialize list of labels given + remarks per user
  userLabels: Array<any> = []

  // Will be changed once @inproject decorator is merged
  admin: boolean;
  // Initialize the username of the current user
  username: string;

  allLabels = []

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
    private labellingDataService: LabellingDataService,
    private router: Router) {
    this.routeService = new ReroutingService();
    this.artifact = new StringArtifact(0, 'null', 'null');
    this.labelTypes = new Array<LabelType>();
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

    this.getLabelTypesWithLabels(p_id)
    console.log(this.labelTypes)
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
  }

  /**
   * Function for getting the label and labeltypes
   * @param p_id
   */
   async getLabelTypesWithLabels(p_id: number): Promise<void> {
    try {
      const labelTypes =
        await this.labellingDataService.getLabelTypesWithLabels(p_id);
      this.labelTypes = labelTypes;
    } catch {
      this.router.navigate(['/project', p_id]);
    }
  }

}