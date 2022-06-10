/**
 * @author B. Henkemans
 * @author T. Bradley
 */
import { Component, OnInit } from '@angular/core';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { LabelFormComponent } from 'app/modals/label-form/label-form.component';
import { LabelingDataService } from "app/services/labeling-data.service";
import { StringArtifact } from 'app/classes/stringartifact';
import { LabelType } from 'app/classes/label-type';

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
   * start and end char are indices for highlighted text
   */
  artifact?: StringArtifact;
  labels?: Array<LabelType>;
  hightlightedText: string = "";
  selectionStartChar?: number;
  selectionEndChar?: number;

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
    // this.getArtifact();
    this.getLabels();
  }

  /**
   * Function which subscribes to the labelingDataService and retrieves the artifact.
   * It waits for a response and when the response arrives it adds Bartjan 
   * as a labeler and then puts the information into this.artifact.
   */
  getArtifact():void {
    // this.labelingDataService.getArtifact()
    //   .subscribe(artifact => {
    //     artifact.addLabeler("Bartjan");
    //     this.artifact = artifact;
    //   });
  }

  /**
   * Function which subscribes to the labelingDataService and retrieves labels.
   * It waits for a response, when the response arrives it puts the information into this.labels.
   */
  getLabels (): void {
    // this.labelingDataService.getLabels()
    //   .subscribe(labels => this.labels = labels);
  }


  /**
   * Function is ran on mouseDown or mouseUp and updates the current selection
   * of the artifact. If the selection is null or empty, the selection is set 
   * to ""
   */
  selectedText():void {
    let hightlightedText: Selection | null = document.getSelection();
    //gets the start and end indices of the highlighted bit
    let startCharacter: number = hightlightedText?.anchorOffset!;
    let endCharacter: number = hightlightedText?.focusOffset!;
    //make sure they in the right order
    if (startCharacter > endCharacter) {
      startCharacter = hightlightedText?.focusOffset!;
      endCharacter = hightlightedText?.anchorOffset!;
    }
    //put into global variable
    this.selectionStartChar = startCharacter;
    this.selectionEndChar = endCharacter;
    //this is so the buttons still pop up, idk if we need it so ill ask bartgang
    if (hightlightedText == null || hightlightedText.toString().length <= 0) {
      this.hightlightedText = "";
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
   * Splitting function, gets text without splitting words and gets start and end char
   */
  split(): void {
    let firstCharacter = this.selectionStartChar!;
    let lastCharacter = this.selectionEndChar!;
    firstCharacter = this.posFixer(firstCharacter, lastCharacter)[0];
    lastCharacter = this.posFixer(firstCharacter, lastCharacter)[1] + 1;
    let splitText = this.artifact?.data.substring(firstCharacter, lastCharacter);
    alert("The text is: '" + splitText + "'\nThe start is at: "
     + firstCharacter + "\nThe end is at: " + lastCharacter);
  }

  /**
   * Gets the correct indices so that words aren't split
   */
  posFixer(startPos:number, endPos:number) {
    //get the chars at index
    let chart = this.artifact?.data.charAt(startPos);
    let chend = this.artifact?.data.charAt(endPos - 1);
    //if you just select the space
    if (startPos - endPos == 1) {
      return [startPos, endPos];
    }
    //else we move until we hit a space
    while ( chart!= ' ' && startPos != -1) {
      chart = this.artifact?.data.charAt(startPos);
      startPos = startPos - 1;
    }
    while (chend != ' ' && endPos != this.artifact?.data.length) {
      chend = this.artifact?.data.charAt(endPos);
      endPos++;
      console.log(chend,endPos);
    }
    //last adjustements from going too far
    startPos = startPos + 2;
    endPos = endPos - 2;
    return [startPos, endPos]; 
  }
  

  /**
   * Error function for unimplemented features.
   */
  notImplemented(): void{
    throw new Error("This function has not been implemented yet.");
  }
}
