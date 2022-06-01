// <!-- Author: Victoria Bogachenkova -->
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CreateLabelFormComponent } from '../create-label-form/create-label-form.component';

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

  labelName: String = 'Label 1';
  labelType: Array<String> = ["Emotion", "Positive"];
  labelDescription: String = 'This is a label description.';
  labelThemes: Array<String> = ['Funny',' Positivity',' Casual']

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
    const modalRef = this.modalService.open(CreateLabelFormComponent,  { size: 'xl'});
    // modalRef.componentInstance.users = this.all_members;
    // // Push the username into the members list 
    // modalRef.componentInstance.newItemEvent.subscribe(($e: any) => {
    //   var username = {userName: $e};
    //   this.project_members.push(username);
    // })
  }

  ngOnInit(): void {
  }

}