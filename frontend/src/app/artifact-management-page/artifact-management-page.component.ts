import { Component, OnInit } from '@angular/core';
import { AddArtifactComponent } from '../add-artifact/add-artifact.component';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Artifact_Management } from '../artifact_management';
import axios from 'axios';


@Component({
  selector: 'app-artifact-management-page',
  templateUrl: './artifact-management-page.component.html',
  styleUrls: ['./artifact-management-page.component.scss']
})
export class ArtifactManagementPageComponent implements OnInit {
  //Pagination Settings
  page = 1;
  pageSize = 5;

  p_id = 4;

  artifacts: Artifact_Management[] = [];
 /**
 * Constructor passes in the modal service
 * @param modalService 
 * @param labelingDataService 
 */
    constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    // Make list of all artifacts

    console.log(this.p_id)
    let token: string | null  = sessionStorage.getItem('ses_token');
    if (typeof token === "string"){

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

          // For each project in the list
          for (let artifact of response.data){

            // Initialize a new project with all values
            console.log(artifact)
            let artifactJson = artifact["artifact"];
            artifactJson["id"] = artifact["artifact_id"];
            artifactJson["data"] = artifact["artifact_text"];
            artifactJson["numberOfUsers"] = artifact["artifact_users"];
            // artifactJson["completed"] = artifact["artifact_completed"];

            let artifactNew: Artifact_Management = artifactJson as Artifact_Management;                

            // Add project to list
            this.artifacts.push(artifactNew);
          }
        })
        // If there is an error
        // TODO change
        .catch(error => {console.log(error)});
    } 
  }
  
  open(){
    const modalRef = this.modalService.open(AddArtifactComponent, { size: 'lg'});
  }
  
}
