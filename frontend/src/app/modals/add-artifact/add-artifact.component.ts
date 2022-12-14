// Victoria Bogachenkova
// Ana-Maria Olteniceanu

import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/services/rerouting.service';
import { ArtifactDataService } from 'app/services/artifact-data.service';
import { ToastCommService } from 'app/services/toast-comm.service';


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

  /* Whether the message is an error */
  error = false;

  /**
   * Initializes the modal
   *
   * @param activeModal modal init
   * @param artifactDataService instance of ArtifactDataService
   * @param router instance of Router
   */
  constructor(public activeModal: NgbActiveModal,
    private artifactDataService: ArtifactDataService,
    private toastCommService: ToastCommService,
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
    // Gets the event that caused the change
    const input = event.target as HTMLInputElement;

    // Checks whether the event is non null
    if (!input.files?.length) {
      return;
    }

    // Stores the file in a the "file" variable
    this.file = input.files[0];

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
  async fileUpload(): Promise<void> {
    // Make sure error is reset
    this.error = false;

    // Stores the project id in a local variable
    let p_id = this.p_id;

    // Array with artifacts to be uploaded
    let artifacts: Array<string> = [];

    // Try reading the file
    try {
      await this.readFile().then(async (added_artifacts) => {
        // Checks if any artifacts have been read from the file
        if (added_artifacts.length == 0) {
          // If no artifacts were added and no error was detected,
          // make an error message
          if (!this.error) {
            this.toastCommService.emitChange([false, "No artifacts were uploaded"])
            this.error = true;
          }
        }

        // Stop if an error has been found
        if (this.error) return;

        // Put the artifacts from the file in artifacts
        artifacts = added_artifacts;

        // Record to get information to backend
        let allArtifacts: Record<string, any>[] = [];

        // Get the information of each artifact
        for (const data of artifacts) {
          // Record with all the artifact information
          let artifactInformation: Record<string, any> = {};

          // Artifact information
          artifactInformation = {
            'data': data,
            'p_id': p_id
          }
          // Add the info of this artifact to the list of artifact information
          allArtifacts.push(artifactInformation);
        }

        try {
          // Add the artifacts to the backend
          await this.addArtifacts(p_id, allArtifacts)
        } catch (e) {
        }
        // Close modal
        this.activeModal.close();

      });
    } catch (e) {
      // Ensures an error message is displayed
      this.toastCommService.emitChange([false, "Error uploading artifacts"])
      this.error = true;
      return;
    }
  }

  /**
       * Makes a request to the backend to add artifacts
       * 
       * @param pid number, the id of the project
       * @param artifacts record, has the data of all the artifacts that need to be added
       */
  async addArtifacts(pid: number, artifacts: Record<string, any>[]): Promise<void> {
    let response = await this.artifactDataService.addArtifacts(pid, artifacts);
    // Indicates that the upload was successful
    this.toastCommService.emitChange([true, "Upload successful. Artifact identifier: ".concat(response['identifier'])])
    if (!response['admin']) {
      this.toastCommService.emitChange([false,
        "You are not admin, so you will not be able to see the artifacts you have not labelled"])
    }
    this.error = false;
  }

  /**
   * Reads the uploaded file and returns the artifacts
   * from the file, if any
   * 
   * @returns an array of strings that contains the artifacts from this.file
   */
  async readFile(): Promise<Array<string>> {
    // Checks whether the file is a text file, if not displays error
    if (this.file?.type != "text/plain") {
      // Ensures an error message is displayed
      this.toastCommService.emitChange([false, "Invalid file type, should be .txt"])
      this.error = true;
      // Exists function
      return [];
    }

    // Creates a FileReader object, will be used to read the content of a file
    var myReader: FileReader = new FileReader();
    // Starts reading the file
    myReader.readAsText(this.file);
    // Behaviour of what happens when a file is read
    return new Promise((resolve) => {
      myReader.onloadend = () => {
        // Array which will hold the uploaded artifacts
        let new_artifacts: Array<string> = [];

        try {
          // Checks whether the content of the file is a string, and splits the string on newlines
          if (typeof (myReader.result) === 'string') {
            new_artifacts = myReader.result.split(/\r?\n/);
          }
        } catch {
          this.toastCommService.emitChange([false, "File not formatted correctly"]);
        }

        // Removes the artifacts which are only a newline
        new_artifacts = new_artifacts.filter(e => e);
        resolve(new_artifacts);
      }
    });
  }
}