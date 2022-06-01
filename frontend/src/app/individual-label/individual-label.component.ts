// <!-- Author: Victoria Bogachenkova -->
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
export class IndividualLabelComponent implements OnInit {
  
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

  constructor(private modalService: NgbModal) {}

  // Open the modal and populate it with users
  openEdit() {
    const modalRef = this.modalService.open(EditLabelFormComponent,  { size: 'xl'});
  }

  ngOnInit(): void {
  }

}