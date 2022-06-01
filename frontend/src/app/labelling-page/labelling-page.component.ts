/**
 * @author B. Henkemans
 */
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

  /**
   * artifact contains the artifact
   * labels contains the label(types) connected to this project
   * highlightedText contains a selection of the artifact
   */
  artifact?: StringArtifact;
  labels?: Array<LabelType>;
  hightlightedText: string = "";

  /**
   * Constructor passes in the modal service and the labeling data service
   * @param modalService 
   * @param labelingDataService 
   */
  constructor(private modalService: NgbModal, 
    private labelingDataService: LabelingDataService) { }

  /**
   * ngOnInit runs after the constructor. When the constructor is executed
   * the artifacts and labels are pulled in
   */
  ngOnInit(): void {
    this.getArtifact();
    this.getLabels();
  }

  /**
   * Function which subscribes to the labelingDataService and retrieves the artifact.
   * It waits for a response and when the response arrives it adds Bartjan 
   * as a labeler and then puts the information into this.artifact.
   */
  getArtifact ():void {
    this.labelingDataService.getArtifact()
      .subscribe(artifact => {
        artifact.addLabeler("Bartjan");
        this.artifact = artifact;
      });
  }

  /**
   * Function which subscribes to the labelingDataService and retrieves labels.
   * It waits for a response, when the response arrives it puts the information into this.labels.
   */
  getLabels (): void {
    this.labelingDataService.getLabels()
      .subscribe(labels => this.labels = labels);
  }


  /**
   * Function is ran on mouseDown or mouseUp and updates the current selection
   * of the artifact. If the selection is null or empty, the selection is set 
   * to ""
   */
  selectedText():void {
    var hightlightedText: Selection | null = document.getSelection();
    if (hightlightedText == null || hightlightedText.toString().length <= 0) {
      this.hightlightedText = ""
    } else {
      this.hightlightedText = hightlightedText.toString();
    }
  }
  
  /**
   * Opens modal which contains the create LabelFormComponent.
   */
  open():void {
    const modalRef = this.modalService.open(LabelFormComponent, { size: 'xl'});
  }
  
  /**
   * Error function for unimplemented features.
   */
  notImplemented(): void{
    throw new Error("This function has not been implemented yet.");
  }
}
