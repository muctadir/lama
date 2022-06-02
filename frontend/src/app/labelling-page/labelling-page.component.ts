/**
 * @author B. Henkemans
 * @author T. Bradley
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
   * start and end char are indices for highlighted text
   */
  artifact?: StringArtifact;
  labels?: Array<LabelType>;
  hightlightedText: string = "";
  startChar?: number;
  endChar?: number;

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
    //gets the start and end indices of the highlighted bit
    var start: number = hightlightedText?.anchorOffset!;
    var end: number = hightlightedText?.focusOffset!;
    //make sure they in the right order
    if (start > end) {
      start = hightlightedText?.focusOffset!;
      end = hightlightedText?.anchorOffset!;
    }
    //put into global variable
    this.startChar = start
    this.endChar = end
    //this is so the buttons still pop up, idk if we need it so ill ask bartgang
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
   * Splitting function, gets text without splitting words and gets start and end char
   */
  split(): void {
    var first = this.startChar!;
    var last = this.endChar!;
    first = this.posFixer(first, last)[0];
    last = this.posFixer(first, last)[1] + 1;
    var splitText = this.artifact?.data.substring(first, last);
    alert("the text is: '" + splitText + "'\nthe start is at: "
     + first + "\nthe end is at: " + last);
  }

  /**
   * Gets the correct indices so that words arent split
   */
  posFixer(start:number, end:number) {
    //get the chars at index
    var chart = this.artifact?.data.charAt(start);
    var chend = this.artifact?.data.charAt(end - 1);
    //if you just select the space
    if (start - end == 1) {
      return [start, end]
    }
    //else we move until we hit a space
    while ( chart!= ' ' && start != -1) {
      chart = this.artifact?.data.charAt(start);
      start = start- 1;
    }
    while (chend != ' ' && end != this.artifact?.data.length) {
      chend = this.artifact?.data.charAt(end);
      end++;
      console.log(chend,end)
    }
    //last adjustements from going too far
    start = start + 2;
    end = end - 2;
    return [start, end]; 
  }
  

  /**
   * Error function for unimplemented features.
   */
  notImplemented(): void{
    throw new Error("This function has not been implemented yet.");
  }
}
