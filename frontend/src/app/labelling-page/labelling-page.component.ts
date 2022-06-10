/**
 * @author B. Henkemans
 * @author T. Bradley
 */
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LabelFormComponent } from 'app/label-form/label-form.component';
import { LabellingDataService } from 'app/labelling-data.service';
import { ArtifactDataService } from 'app/artifact-data.service';
import { StringArtifact } from 'app/classes/stringartifact';
import { LabelType } from 'app/classes/label-type';

import { Router } from '@angular/router';
import { ReroutingService } from 'app/rerouting.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-labelling-page',
  templateUrl: './labelling-page.component.html',
  styleUrls: ['./labelling-page.component.scss'],
})
export class LabellingPageComponent implements OnInit {
  /**
   * artifact contains the artifact
   * labels contains the label(types) connected to this project
   * highlightedText contains a selection of the artifact
   * start and end char are indices for highlighted text
   */

  artifact?: StringArtifact;
  labels?: Array<LabelType>;
  hightlightedText: string = '';
  selectionStartChar?: number;
  selectionEndChar?: number;
  routeService: ReroutingService;
  url: string;
  labellers: Array<any>;
  p_id: number;
  labelTypes: Array<LabelType>;
  form: FormGroup;
  labellings: FormArray;

  /**
   * Constructor passes in the modal service and the labelling data service
   * @param modalService
   * @param labellingDataService
   */
  constructor(
    private modalService: NgbModal,
    private labellingDataService: LabellingDataService,
    private artifactDataService: ArtifactDataService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.routeService = new ReroutingService();
    this.url = this.router.url;
    this.artifact = new StringArtifact(-1, 'null', 'null');
    this.labellers = new Array();
    this.p_id = parseInt(this.routeService.getProjectID(this.url));
    this.labelTypes = new Array<LabelType>();
    this.labellings = new FormArray([]);
    this.form = new FormGroup({
      labellings: this.labellings
    });
  }

  /**
   * We are going to send an array to the backend
   */
  /**
   * ngOnInit runs after the constructor. When the constructor is executed
   * the artifacts and labels are pulled in
   */
  ngOnInit(): void {
    this.getRandomArtifact(this.p_id);
    this.getLabelTypesWithLabels(this.p_id);
    this.labelTypes.forEach(() => {
      console.log("ff")

    })
  }

  /**
   * Function which subscribes to the labellingDataService and retrieves the artifact.
   * It waits for a response and when the response arrives it adds Bartjan
   * as a labeler and then puts the information into this.artifact.
   */
  async getRandomArtifact(p_id: number): Promise<void> {
    const artifact = await this.artifactDataService.getRandomArtifact(p_id);
    this.artifact = artifact;
    const labellers = await this.artifactDataService.getLabellers(
      p_id,
      artifact.getId()
    );
    this.labellers = labellers;
  }

  async getLabelTypesWithLabels(p_id: number): Promise<void> {
    const labelTypes = await this.labellingDataService.getLabelTypesWithLabels(
      p_id
    );
    this.labelTypes = labelTypes;
  }

  /**
   * Function is ran on mouseDown or mouseUp and updates the current selection
   * of the artifact. If the selection is null or empty, the selection is set
   * to ""
   */
  selectedText(): void {
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
      this.hightlightedText = '';
    } else {
      this.hightlightedText = hightlightedText.toString();
    }
  }

  /**
   * Opens modal which contains the create LabelFormComponent.
   */
  open(): void {
    this.modalService.open(LabelFormComponent, { size: 'xl' });
  }

  /**
   * Skip to another random artifact
   */
  skip(): void {
    this.getRandomArtifact(this.p_id);
  }

  /**
   * Splitting function, gets text without splitting words and gets start and end char
   */
  split(): void {
    let firstCharacter = this.selectionStartChar!;
    let lastCharacter = this.selectionEndChar!;
    firstCharacter = this.posFixer(firstCharacter, lastCharacter)[0];
    lastCharacter = this.posFixer(firstCharacter, lastCharacter)[1] + 1;
    let splitText = this.artifact?.data.substring(
      firstCharacter,
      lastCharacter
    );
    alert(
      "The text is: '" +
        splitText +
        "'\nThe start is at: " +
        firstCharacter +
        '\nThe end is at: ' +
        lastCharacter
    );
  }

  /**
   * Gets the correct indices so that words aren't split
   */
  posFixer(startPos: number, endPos: number) {
    //get the chars at index
    let chart = this.artifact?.data.charAt(startPos);
    let chend = this.artifact?.data.charAt(endPos - 1);
    //if you just select the space
    if (startPos - endPos == 1) {
      return [startPos, endPos];
    }
    //else we move until we hit a space
    while (chart != ' ' && startPos != -1) {
      chart = this.artifact?.data.charAt(startPos);
      startPos = startPos - 1;
    }
    while (chend != ' ' && endPos != this.artifact?.data.length) {
      chend = this.artifact?.data.charAt(endPos);
      endPos++;
      console.log(chend, endPos);
    }
    //last adjustements from going too far
    startPos = startPos + 2;
    endPos = endPos - 2;
    return [startPos, endPos];
  }

  /**
   * Gets the project id from the URL and reroutes to the single label page
   * of the same project
   *
   * @trigger click on label
   */
  reRouter(): void {
    // Use reroutingService to obtain the project ID
    let p_id = this.routeService.getProjectID(this.url);

    // Changes the route accordingly
    this.router.navigate(['/project', p_id, 'labelling-page']);
  }

  /**
   * Error function for unimplemented features.
   */
  notImplemented(): void {
    throw new Error('This function has not been implemented yet.');
  }

  submit() : void {
    let resultArray: Array<Object> = Array<Object>();
    this.labellings.controls.forEach((el: any) => {
      resultArray.push({
        'labelTypeID': el.get('labelType')?.value,
        'labelId': el.get('label')?.value,
        'remark': el.get('remark')?.value
      });
      console.log(resultArray)
    });
  }
}
