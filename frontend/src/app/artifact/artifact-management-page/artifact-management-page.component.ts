// Ana-Maria Olteniceanu
// Bartjan Henkemans
// Victoria Bogachenkova
// Thea Bradley
// Eduardo Costa Martins

import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StringArtifact } from 'app/classes/stringartifact';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/services/rerouting.service';
import { AddArtifactComponent } from 'app/modals/add-artifact/add-artifact.component';
import { ArtifactDataService } from 'app/services/artifact-data.service';
import { LabellingDataService } from 'app/services/labelling-data.service';
import { FormBuilder } from '@angular/forms';
import { ToastCommService } from 'app/services/toast-comm.service';
import { ProjectDataService } from 'app/services/project-data.service';

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
  // Initialize the project id
  p_id: number;
  // Make list of all _received_ artifacts
  // A page number maps to a list of artifacts on that page
  artifacts: Record<number, Array<StringArtifact>> = {};
  // Number of artifacts
  nArtifacts: number = 0;
  // Number of label types
  nLabelTypes: number;

  // Bool on if there is text in the search bar
  search = false;

  // Pagination Settings
  page = 1;
  pageSize = 5;

  // Gets the search terms
  searchForm = this.formBuilder.group({
    search_term: ''
  });

  frozen: boolean = true;


  /**
   * Constructor which:
   * 1. gets a router
   * 2. gets the url
   * 3. gets the project id
   * 4. initializes the number of label types
   */
  constructor(private modalService: NgbModal,
    private artifactDataService: ArtifactDataService,
    private labellingDataService: LabellingDataService,
    private router: Router, private formBuilder: FormBuilder,
    private toastCommService: ToastCommService,
    private projectDataService: ProjectDataService) {
    this.routeService = new ReroutingService();
    this.url = this.router.url;
    this.p_id = Number(this.routeService.getProjectID(this.url))
    this.nLabelTypes = 0;
  }

  async ngOnInit(): Promise<void> {
    this.frozen = await this.projectDataService.getFrozen();

    // Clear cache and get the artifacts from the backend
    this.artifacts = {};
    await this.getArtifacts();

    // Function for clicking on the magnifying glass
    this.searchClick();
  }

  /**
   * Function for searching based on clicking on the maginifying glass
   */
  searchClick(){
    // Get the search image
    let searchBar = document.getElementById("searchBar")
    if (searchBar != null){
      // On click event handler
      searchBar.onclick = (e) => {
        if (searchBar != null){
          // Get clicked x coordinates
          var x = e.clientX - searchBar.getBoundingClientRect().left;
          // When clicked in the maginifying glass
          if (x > 330){
            // Search
            this.onEnter()
          }
        }
      }
    }
  }

  /**
   * Sets the artifacts of a specific project from artifact-data.service
   * 
   * @param p_id the id of the project
   */
  async getArtifacts(): Promise<void> {

    // If we do not already have the artifacts for this page cached
    if (!this.artifacts.hasOwnProperty(this.page)) {
      // Get the seek index of this page
      const [seekIndex, seekPage] = this.getSeekInfo(this.page);
      // Get the artifacts for this page
      const result = await this.artifactDataService.getArtifacts(this.p_id, this.page, this.pageSize, seekIndex, seekPage);
      // If the number of artifacts changed, then we need to reset the cache.
      if (result[0] != this.nArtifacts) {
        this.nArtifacts = result[0];
        this.nLabelTypes = result[1]
        this.artifacts = {};
      }
      // Cache artifacts for this page
      this.artifacts[this.page] = result[2];
    }

  }

  /**
   * Used for the Seek Method
   * @param page the page that we are searching for
   * @return the largest index we can exclude in the SQL query
   * @return the page corresponding to this index
   */
  getSeekInfo(page: number): [number, number] {
    // Go backwards from the page we need (to get the closest/largest page)
    for (let i: number = page - 1; i >= 1; i--) {
      // See if we have already retrieved artifacts for that page
      if (this.artifacts.hasOwnProperty(i)) {
        // Get the artifacts for that page
        let artifacts: StringArtifact[] = this.artifacts[i];
        // Get the index of the last artifact (the largest index)
        let seekIndex: number = artifacts[artifacts.length - 1].getId();
        // The index can be used to exclude artifacts from the query (before the offset)
        // The page needs to be passed to see how many artifacts we still need to offset
        return [seekIndex, i]
      }
    }
    // Worst case scenario when we have not cached any previous pages
    // Then we have to offset everything
    return [0, 0];
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
  
  // Open the modal
  open() {
    const modalRef = this.modalService.open(AddArtifactComponent, { size: 'lg' });
    modalRef.result.then((data) => {
      this.ngOnInit();
    });
  }  
  
  // Gets the search text
  async onEnter() {
    // Search text
    var text = this.searchForm.value.search_term;
    // Get p_id
    let p_id = Number(this.routeService.getProjectID(this.url));
    // If nothing was searched
    if(text.length == 0){
      // Clear cache and show all artifacts
      this.artifacts = {};
      await this.getArtifacts();
    } else {
      // Otherwise search

      // Pass the search word to services
      let artifactsSearched = await this.artifactDataService.search(text, p_id);

      // List for the artifacts resulting from the search
      let artifactList: Array<StringArtifact> = [];
      // For loop through all searched artifacts
      for (let searchArtifact of artifactsSearched) {
        // Make it an artifact object
        let newArtifact = new StringArtifact(searchArtifact["id"], searchArtifact["identifier"], searchArtifact['data']);
        // Append artifact to list
        artifactList.push(newArtifact);
      }
      // Only show the resulting artifacts from the search
      // Update length and clear cache
      this.nArtifacts = artifactList.length;
      this.artifacts = {};
      // Slice the resulting artifacts into pages
      for (let i: number = 1; i <= Math.ceil(artifactList.length / this.pageSize); i++) {
        // Each page gets as many artifacts as can fit in a page
        // Last page may not have that many artifacts, hence Math.min to choose remaining artifacts instead
        this.artifacts[i] = artifactList.slice((i - 1) * this.pageSize, Math.min(
          artifactList.length,
          i * this.pageSize
        ));
      }
    }
  }

  /**
   * Function that returns the number of users who gave a set of labellings
   * @param labellings: number, the number of labellings
   */
  getNumberUsers(labellings: number): string|number{
    if(labellings % this.nLabelTypes != 0) {
      this.toastCommService.emitChange([false, "Something is wrong with the labellings"]);
      return "Cannot compute";
    }
    else {
      return Math.floor(labellings / this.nLabelTypes)
    }
  }

}
