import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-artifact',
  templateUrl: './add-artifact.component.html',
  styleUrls: ['./add-artifact.component.scss']
})
export class AddArtifactComponent implements OnInit {

  save(){
    throw new Error("This function has not been implemented yet.");
  }

  constructor(public activeModal: NgbActiveModal) {

    }

  ngOnInit(): void {
  }

}
