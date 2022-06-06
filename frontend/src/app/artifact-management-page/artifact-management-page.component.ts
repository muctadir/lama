// Ana-Maria Olteniceanu
// Bartjan Henkemans
// Victoria Bogachenkova

import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StringArtifact } from 'app/classes/stringartifact';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/rerouting.service';
import { AddArtifactComponent } from 'app/add-artifact/add-artifact.component';
import { ArtifactDataService } from 'app/artifact-data.service';


@Component({
  selector: 'app-artifact-management-page',
  templateUrl: './artifact-management-page.component.html',
  styleUrls: ['./artifact-management-page.component.scss']
})
export class ArtifactManagementPageComponent {
  // Initialize the ReroutingService
  routeService: ReroutingService;
  // Initialize the url
  url: string;
  // Make list of all artifacts
  artifacts: StringArtifact[];

  //Pagination Settings
  page = 1;
  pageSize = 5;

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
    this.url = this.router.url;
    this.artifacts = new Array<StringArtifact>()
  }

  ngOnInit(): void {
    const p_id = Number(this.routeService.getProjectID(this.url))
    this.getArtifacts(p_id)
  }

  async getArtifacts(p_id: number): Promise<void> {
    const artifacts = await this.artifactDataService.getArtifacts(p_id);
    this.artifacts = artifacts
  }

  /**
   * Gets the project id from the URL and reroutes 
   * to the single artifact view of the same project
   * 
   * @trigger user clicks on artifact
   */
  reRouter(a_id: number): void {
    // Use reroutingService to obtain the project ID
    let p_id = this.routeService.getProjectID(this.url);

    // Changes the route accordingly
    this.router.navigate(['/project', p_id, 'singleartifact', a_id]);
  }

  notImplemented(): void {
    alert("Button has not been implemented yet.");
  }
  open() {
    const modalRef = this.modalService.open(AddArtifactComponent, { size: 'lg' });
  }

}
