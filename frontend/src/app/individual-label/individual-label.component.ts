// <!-- Author: Victoria Bogachenkova -->
import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/rerouting.service';

import { EditLabelFormComponent } from '../edit-label-form/edit-label-form.component';

// Type for artifact
type artifact = {
  artifactId: number,
  artifactLabeler: string,
  artifactRemarks: string
}

@Component({
  selector: 'app-individual-label',
  templateUrl: './individual-label.component.html',
  styleUrls: ['./individual-label.component.scss']
})
export class IndividualLabelComponent {
  
  // Dummy data
  labelName: String = 'Label 1';
  labelType: Array<String> = ["Emotion", " Positive"];
  labelDescription: String = 'This is a label description.';
  labelThemes: Array<String> = ['Funny',' Positivity',' Casual']

  // Dummy data
  artifacts: Array<artifact> = [
    {
      artifactId: 33,
      artifactLabeler: "Veerle",
      artifactRemarks: "I thought that this was appropriate because"
    },
    {
      artifactId: 35,
      artifactLabeler: "Chinno",
      artifactRemarks: "I thought that this was appropriate because it is cool"
    }
  ]

  constructor(private modalService: NgbModal, private router: Router) {}

  // Open the modal and populate it with users
  openEdit() {
    const modalRef = this.modalService.open(EditLabelFormComponent,  { size: 'xl'});
  }

  /**
   * Gets the project id from the URL and reroutes to the label management page
   * of the same project
   * 
   * @trigger back button is pressed
   */
   reRouter() : void {
    // Gets the url from the router
    let url: string = this.router.url
    
    // Initialize the ReroutingService
    let routeService: ReroutingService = new ReroutingService();
    // Use reroutingService to obtain the project ID
    let p_id = routeService.getProjectID(url);
    
    // Changes the route accordingly
    this.router.navigate(['/project', p_id, 'labelmanagement']);
  }

}