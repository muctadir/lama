import { Component } from '@angular/core';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { StringArtifact } from 'app/classes/stringartifact';
import axios from 'axios';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/rerouting.service';
import { AddArtifactComponent } from 'app/add-artifact/add-artifact.component';


@Component({
  selector: 'app-artifact-management-page',
  templateUrl: './artifact-management-page.component.html',
  styleUrls: ['./artifact-management-page.component.scss']
})
export class ArtifactManagementPageComponent {
  //Pagination Settings
  page = 1;
  pageSize = 5;

  // Project id. Currently hardcoded
  p_id = 0;

  // Initialize the ReroutingService
  routeService: ReroutingService = new ReroutingService();

  // Make list of all artifacts
  artifacts: StringArtifact[] = [];
  
/**
   * Constructor passes in the modal service, initializes Router
   * @param modalService instance of NgbModal
   * @param router instance of Router
   */
    constructor(private modalService: NgbModal, private router: Router) { }

    ngOnInit(): void {

    let token: string | null  = sessionStorage.getItem('ses_token');
    if (typeof token === "string"){

    // Gets the url from the router
    let url: string = this.router.url

    // Use reroutingService to obtain the project ID
    this.p_id = Number(this.routeService.getProjectID(url));

      // Get the information needed from the back end
      axios.get('http://127.0.0.1:5000/artifact/artifactmanagement', {
        headers: {
          'u_id_token': token
        },
        params: {
          'p_id' : this.p_id
        }
      })
        // When there is a response get the artifacts
        .then(response => {

          // For each artifact in the list
          for (let artifact of response.data){

            // Initialize a new artifact with all values
            let artifactJson = artifact["artifact"];
            artifactJson["id"] = artifact["artifact_id"];
            artifactJson["identifier"] = artifact["artifact_identifier"],
            artifactJson["data"] = artifact["artifact_text"];
            artifactJson["labellings"] = artifact["artifact_labellings"];

            // Create an artifact object
            let artifactNew: StringArtifact = new StringArtifact(
              artifactJson["id"],
              artifactJson["identifier"],
              artifactJson["data"]
            )

            // Get the number of labellings on this artifact
            artifactNew.setLabellings(artifactJson["labellings"])

            // Add artifact to list
            this.artifacts.push(artifactNew);
          }
        })
        // If there is an error
        // TODO change
        .catch(error => {console.log(error)});
    } 
  }

  /**
   * Gets the project id from the URL and reroutes 
   * to the single artifact view of the same project
   * 
   * @trigger user clicks on artifact
   */
   reRouter(a_id: number) : void {
    // Gets the url from the router
    let url: string = this.router.url
    
    // Initialize the ReroutingService
    let routeService: ReroutingService = new ReroutingService();
    // Use reroutingService to obtain the project ID
    let p_id = routeService.getProjectID(url);
    
    // Changes the route accordingly
    this.router.navigate(['/project', p_id, 'singleartifact', a_id]);
  }

  notImplemented(): void {
    alert("Button has not been implemented yet.");
  }
  open(){
    const modalRef = this.modalService.open(AddArtifactComponent, { size: 'lg'});
  }
  
}
