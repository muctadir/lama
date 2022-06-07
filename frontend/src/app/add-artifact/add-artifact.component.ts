import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-artifact',
  templateUrl: './add-artifact.component.html',
  styleUrls: ['./add-artifact.component.scss']
})
export class AddArtifactComponent {

  /* Stores the file that the user uploads */
  file: File | null = null;

  /* Message displayed to the user, success or failure */
  message: string = "";

  /* Whether the message is an error */
  error : boolean = false;

  /**
   * Initializes the modal
   * 
   * @param activeModal modal init
   */
  constructor(public activeModal: NgbActiveModal) { }

  /**
   * Stores the file uploaded by the user to the @file variable
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
  }

  /**
   * Function which checks whether the file is a text file.
   * The text file gets parsed based on the newlines.
   * The resulting artifacts gets send to the database.
   * 
   * @modifies message, error
   * 
   * @TODO add database connection
   */
  fileUpload(): void {

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
    myReader.onloadend = function(){

      // Checks whether the content of the file is a string, and splits the string on newlines
      if (typeof(myReader.result) === 'string' ) {
        new_artifacts = myReader.result.split(/\r?\n/);
      }

      // Removes the artifacts which are only a newline
      new_artifacts =  new_artifacts.filter(e => e);

      // TODO call the database to upload the artifacts
      console.log(new_artifacts);

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
