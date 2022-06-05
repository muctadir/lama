import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/rerouting.service';
import axios from 'axios';
import { User } from 'app/classes/user';

@Component({
  selector: 'app-add-artifact',
  templateUrl: './add-artifact.component.html',
  styleUrls: ['./add-artifact.component.scss']
})
export class AddArtifactComponent {

  /* Stores the file that the user uploads */
  file: File | null = null;

  // Project ID
  p_id: number | null = null

  // Initialize the ReroutingService
  routeService: ReroutingService = new ReroutingService();

  // Gets the url from the router
  url: string = this.router.url

  /**
   * Initializes the modal
   * 
   * @param activeModal modal init
   * @param router instance of Router
   */
  constructor(public activeModal: NgbActiveModal, private router: Router) { }

  /**
   * Stores the file uploaded by the user to the @file variable 
   * and stores the ID of the current project to the @p_id variable
   * 
   * @param event The file upload event
   * @returns nothing
   */
  onChange(event: Event): void {
    // gets the event that caused the change
    const input = event.target as HTMLInputElement;

    // Checks whether the event is non null
    if (!input.files?.length) {
        return;
    }

    // stores the file in a the "file" variable
    this.file = input.files[0];
    console.log(this.file);

    // Use reroutingService to obtain the project ID
    this.p_id = Number(this.routeService.getProjectID(this.url));
    console.log(this.p_id)
  }

  /**
   * Function which checks whether the file is a text file.
   * The text file gets parsed based on the newlines.
   * The resulting artifacts gets send to the database.
   * 
   * @returns nothing
   */
  fileUpload(): void {
    // Stores the project id in a local variable
    let p_id = this.p_id
    
    // Array which will hold the uploaded artifacts
    let new_artifacts: Array<string> = [];

    // Checks whether the file is a text file, if not displays error
    if (this.file?.type != "text/plain") {
      return;
    } 

    // Crates a FileReader object, will be used to read the content of a file
    var myReader: FileReader = new FileReader();

    // Behaviour of what happens when a file is read
    myReader.onloadend = function(){

      // Checks whether the content of the file is a string, and splits the string on newlines
      if (typeof(myReader.result) === 'string' ) {
        new_artifacts = myReader.result.split(/\r?\n/);
      }

      // Removes the artifacts which are only a newline
      new_artifacts =  new_artifacts.filter(e => e);

      // Random identifier
      function makeid(length:number) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * 
            charactersLength));
        }
        return result;
      }

      // Make an identifier
      // TODO: Make it unique
      let identifier = makeid(5);

      // Way to get information to backend
      let artifactInformation: Record<string, any> = {};
      let allArtifacts = []
      for(let i=0; i < new_artifacts.length; i++) {
        
        // Artifact information
        artifactInformation= {
          'name': identifier.concat(i.toString()),
          'identifier' : identifier,
          "data" : new_artifacts[i],
          'p_id' : p_id
        };
        allArtifacts.push(artifactInformation)
      }

      // Message for confirmation/error
      const p_response: HTMLElement = document.querySelector("#createArtifactResponse")!;
      
      let token: string | null  = sessionStorage.getItem('ses_token');

      if (typeof token === "string") {        
        // Send the data to the database
        const response = axios.post('http://127.0.0.1:5000/artifact/creation', allArtifacts, {
          headers: {
            'u_id_token': token
          }
        })
        .then(response => { 
          // TODO
          p_response.innerHTML = "Artifacts added"
        })
        .catch(error => {
          // TODO
        });

      }
    }

    // Starts reading the file
    myReader.readAsText(this.file);

  }

}
