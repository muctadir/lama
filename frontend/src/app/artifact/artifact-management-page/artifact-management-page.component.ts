// Ana-Maria Olteniceanu
// Bartjan Henkemans
// Victoria Bogachenkova
// Thea Bradley 

import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StringArtifact } from 'app/classes/stringartifact';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/services/rerouting.service';
import { AddArtifactComponent } from 'app/modals/add-artifact/add-artifact.component';
import { ArtifactDataService } from 'app/services/artifact-data.service';
import { FormBuilder } from '@angular/forms';

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
  artifacts: Array<StringArtifact> = [];

  //bool on if there is text in the search bar
  search = false;

  //Pagination Settings
  page = 1;
  pageSize = 5;

  // gets the search terms
  searchForm = this.formBuilder.group({
    search_term: ''
  });


  /**
     * Constructor passes in the modal service, the artifact service 
     * and initializes Router
     * @param modalService instance of NgbModal
     * @param artifactDataService instance of ArtifactDataService
     * @param router instance of Router
     */
  constructor(private modalService: NgbModal,
    private artifactDataService: ArtifactDataService,
    private router: Router, private formBuilder: FormBuilder) {
    this.routeService = new ReroutingService();
    this.url = this.router.url;
    this.artifacts = new Array<StringArtifact>();
  }

  ngOnInit(): void {
    // Get the ID of the project
    const p_id = Number(this.routeService.getProjectID(this.url))

    // Get the artifacts from the backend
    this.getArtifacts(p_id);
  }

  /**
   * Sets the artifacts of a specific project from artifact-data.service
   * 
   * @param p_id the id of the project
   */
  async getArtifacts(p_id: number): Promise<void> {
    const artifacts = await this.artifactDataService.getArtifacts(p_id);
    this.artifacts = artifacts;
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
  
  open() {
    const modalRef = this.modalService.open(AddArtifactComponent, { size: 'lg' });
    // When the modal closes, call the getArtifact function to update the displayed artifacts
    modalRef.result.then( async () => {
      this.getArtifacts(Number(this.routeService.getProjectID(this.url))) });
    }
  
  //gets the search text
  async onEnter() {

    // Get p_id
    let p_id = Number(this.routeService.getProjectID(this.url));

    // Search text
    var text = this.searchForm.value.search_term;

    // If nothing was searched
    if(text.length == 0){
      // Show all artifacts
      await this.getArtifacts(p_id);
    } else {
      // Otherwise search
    
      // Pass the search word to services
      let artifacts_searched = await this.artifactDataService.search(text, p_id);

      // List for the artifacts resulting from the search
      let artifact_list: Array<StringArtifact> = [];
      // For loop through all searched artifacts
      for (let search_artifact of artifacts_searched){
        // Make it an artifact object
        let newArtifact = new StringArtifact(search_artifact["id"], search_artifact["identifier"], search_artifact['data']);
        // Append artifact to list
        artifact_list.push(newArtifact);
      }
      // Only show the resulting artifacts from the search
      this.artifacts = artifact_list;
    }
  }

}
