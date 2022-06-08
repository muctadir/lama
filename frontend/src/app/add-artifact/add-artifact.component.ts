// Victoria Bogachenkova
// Ana-Maria Olteniceanu

import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/rerouting.service';
import { ArtifactDataService } from 'app/artifact-data.service';

@Component({
  selector: 'app-add-artifact',
  templateUrl: './add-artifact.component.html',
  styleUrls: ['./add-artifact.component.scss']
})
export class AddArtifactComponent {

  /* Stores the file that the user uploads */
  file: File | null;
  // Project ID
  p_id: number;
  // Initialize the ReroutingService
  routeService: ReroutingService;
  // Gets the url from the router
  url: string;

  /* Message displayed to the user, success or failure */
  message: string = "";

  /* Whether the message is an error */
  error : boolean = false;

  /**
   * Initializes the modal
   * 
   * @param activeModal modal init
   * @param artifactDataService instance of ArtifactDataService
   * @param router instance of Router
   */
  constructor(public activeModal: NgbActiveModal,
    private artifactDataService: ArtifactDataService,
    private router: Router) { 
       this.file = null;
       this.p_id = 0;
       this.routeService = new ReroutingService();
       this.url = this.router.url;
     }

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
  }

  /**
   * Function which checks whether the file is a text file.
   * The text file gets parsed based on the newlines.
   * The resulting artifacts gets send to the database.
   * 
   * @returns nothing
   * @modifies message, error
   * 
   */
  fileUpload(): void {
    // Stores the project id in a local variable
    let p_id = this.p_id

    // Array which will hold the uploaded artifacts
    let new_artifacts: Array<string> = [];

    // Checks whether the file is a text file, if not displays error
    if (this.file?.type != "text/plain") {
      // Ensures an error message is displayed
      this.message = "Invalid file type, should be .txt";
      this.error = true;
      // Exists function
      return;
    }

    // Crates a FileReader object, will be used to read the content of a file
    var myReader: FileReader = new FileReader();
    
    // Behaviour of what happens when a file is read
    myReader.onloadend = function () {

      // Initializes an instance of ArtifactDataService
      let artifactDataService: ArtifactDataService = new ArtifactDataService()

      // Checks whether the content of the file is a string, and splits the string on newlines
      if (typeof (myReader.result) === 'string') {
        new_artifacts = myReader.result.split(/\r?\n/);
      }

      // Removes the artifacts which are only a newline
      new_artifacts = new_artifacts.filter(e => e);

      // Random identifier
      function makeid(length: number) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
        }
        return result;
      }

      async function addArtifacts(pid: number, artifacts: Record<string, any>[]){
        await artifactDataService.addArtifacts(pid, artifacts);
      }

      // Make an identifier
      // TODO: Make it unique
      let identifier = makeid(5);
      console.log(identifier);

      // Way to get information to backend
      let allArtifacts: Record<string, any>[] = [];

      for (let i = 0; i < new_artifacts.length; i++) {
        let artifactInformation: Record<string, any> = {};
        // Artifact information
        artifactInformation = {
          'name': identifier.concat(i.toString()),
          'data': new_artifacts[i],
          'p_id': p_id
        }
        console.log(artifactInformation);
        allArtifacts.push(artifactInformation);
      }
      console.log(allArtifacts);


      // Message for confirmation/error
      const p_response: HTMLElement = document.querySelector("#createArtifactResponse")!;
      addArtifacts(p_id, allArtifacts)
      p_response.innerHTML = "Artifacts added"

    }

    try {
      // Starts reading the file
      myReader.readAsText(this.file);
      // Indicates that the uploading was successful
      this.message = "Upload successful";
      this.error = false;
    } catch(e) {
      // Ensures an error message is displayed
      this.message = "Invalid file type, should be .txt";
      this.error = true;
    }

  }
}
