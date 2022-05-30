import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-artifact',
  templateUrl: './add-artifact.component.html',
  styleUrls: ['./add-artifact.component.scss']
})
export class AddArtifactComponent implements OnInit {

  notImplemented(){
    alert("Not implemented");
  }

  constructor(public activeModal: NgbActiveModal) {

    }

  ngOnInit(): void {
  }

}
