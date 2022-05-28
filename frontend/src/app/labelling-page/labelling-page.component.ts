import { Component, OnInit } from '@angular/core';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { LabelFormComponent } from '../label-form/label-form.component';
import { LabelingDataService } from "app/labeling-data.service";
import { StringArtifact } from 'app/stringartifact';
import { LabelType } from 'app/label-type';

@Component({
  selector: 'app-labelling-page',
  templateUrl: './labelling-page.component.html',
  styleUrls: ['./labelling-page.component.scss']
})
export class LabellingPageComponent implements OnInit{

  artifact?: StringArtifact;
  labels?: Array<LabelType>;
  hightlightedText: Selection | null = null;

  constructor(private modalService: NgbModal, 
    private labelingDataService: LabelingDataService) { }

  ngOnInit(): void {
    this.getArtifact();
    this.getLabels();
  }

  getArtifact ():void {
    this.labelingDataService.getArtifact()
      .subscribe(artifact => {
        artifact.addLabeler("Bartjan");
        this.artifact = artifact;
      });
  }

  getLabels (): void {
    this.labelingDataService.getLabels()
      .subscribe(labels => this.labels = labels);
  }

  
  selectedText() {
    this.hightlightedText = document.getSelection()
  }
  
  open() {
    const modalRef = this.modalService.open(LabelFormComponent, { size: 'xl'});
  }
  
  notImplemented(){
    alert("This button is not implemented.");
  }
}
