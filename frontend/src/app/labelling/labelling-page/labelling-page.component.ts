/**
 * @author B. Henkemans
 * @author T. Bradley
 */
import { Component, EventEmitter, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LabelFormComponent } from 'app/modals/label-form/label-form.component';
import { LabellingDataService } from 'app/services/labelling-data.service';
import { StringArtifact } from 'app/classes/stringartifact';
import { LabelType } from 'app/classes/label-type';
import { ArtifactDataService } from 'app/services/artifact-data.service';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/services/rerouting.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-labelling-page',
  templateUrl: './labelling-page.component.html',
  styleUrls: ['./labelling-page.component.scss'],
})
export class LabellingPageComponent implements OnInit {
  /**
   * Information for the screen
   */
  artifact: StringArtifact;
  labelTypes: Array<LabelType>;
  labellers: Array<any>;

  /**
   * Forms for the labelling
   */
  labellings: FormArray;
  form: FormGroup;
  submitMessage: string;
  eventEmitter: EventEmitter<any>;

  /**
   * Information concerning the highlighting and cutting
   */
  hightlightedText: string = '';
  selectionStartChar?: number;
  selectionEndChar?: number;

  /**
   * Routing
   */
  routeService: ReroutingService;
  url: string;
  p_id: number;

  /**
   * Start and end timestamps
   */
  startTime: any;
  endTime: any;

  /**
   * Constructor passes in the modal service and the labelling data service
   * @param modalService
   * @param labellingDataService
   */
  constructor(
    private modalService: NgbModal,
    private labellingDataService: LabellingDataService,
    private artifactDataService: ArtifactDataService,
    private router: Router
  ) {
    /**
     * Preparing variables for information
     */
    this.artifact = new StringArtifact(-1, 'null', 'null');
    this.labellers = new Array();
    this.labelTypes = new Array<LabelType>();

    /**
     * Setting up forms
     */
    this.labellings = new FormArray([]);
    this.form = new FormGroup({
      labellings: this.labellings,
    });
    this.submitMessage = '';
    this.eventEmitter = new EventEmitter<any>();
    /**
     * Setting up routing
     */
    this.routeService = new ReroutingService();
    this.url = this.router.url;
    this.p_id = parseInt(this.routeService.getProjectID(this.url));
  }

  ngOnInit(): void {
    /**
     * Getting information from the backend
     * This page has a couple of preconditions. These are checked at various points
     * in the initialization process. Namely:
     * 1. An artifact is loaded
     * 2. The labellers is loaded
     * 3. The labels and their types are loaded.
     * If any of this fails the user is redirected back to the stats page.
     */
    this.labellings = new FormArray([]);
    this.eventEmitter.emit();
    this.getRandomArtifact();
    this.getLabelTypesWithLabels();

    // Get the timestamp when this component is opened
    this.startTime = Date.now();
  }

  /**
   * Gets a random artifact from project p_id
   * 1. Awaits response from the backend
   * 2. Puts artifact in the right variable
   * 3. Only then gets the labellers
   * 4. Awaits response
   * 5. Puts labellers into variable
   * @param p_id
   */
  async getRandomArtifact(): Promise<void> {
    try {
      const artifact = await this.artifactDataService.getRandomArtifact(
        this.p_id
      );
      this.artifact = artifact;
    } catch {
      this.router.navigate(['/project', this.p_id]);
    }

    try {
      const labellers = await this.artifactDataService.getLabellers(
        this.p_id,
        this.artifact.getId()
      );
      this.labellers = labellers;
    } catch {
      this.router.navigate(['/project', this.p_id]);
    }

    if (this.artifact.getId() === -1) {
      this.router.navigate(['/project', this.p_id]);
    }
  }

  /**
   * Function for getting the label and labeltypes
   * @param p_id
   */
  async getLabelTypesWithLabels(): Promise<void> {
    try {
      const labelTypes =
        await this.labellingDataService.getLabelTypesWithLabels(this.p_id);
      this.labelTypes = labelTypes;
    } catch {
      this.router.navigate(['/project', this.p_id]);
    }
  }

  /**
   * Opens modal which contains the create LabelFormComponent.
   */
  openCreateForm(): void {
    let modal = this.modalService.open(LabelFormComponent, { size: 'xl' });
    modal.result.then((data) => {
      this.getLabelTypesWithLabels();
    });
  }

  /**
   * Skip to another random artifact
   */
  skip(): void {
    this.submitMessage = '';
    this.ngOnInit();
  }

  /**
   * Gets the project id from the URL and reroutes to the single label page
   * of the same project
   *
   * @trigger click on label
   */
  reRouter(): void {
    // Changes the route accordingly
    this.router.navigate(['/project', this.p_id, 'labelling-page']);
  }

  /**
   *
   */
  submit(): void {
    // Get the timestamp when the labels are submitted
    this.endTime = Date.now();
    // Number of seconds the labellings took
    let totalTime = (this.endTime - this.startTime) / 1000;
    try {
      let resultArray: Array<Object> = this.createResponse(totalTime);
      const dict = {
        p_id: this.p_id,
        resultArray: resultArray,
      };
      this.submitMessage = '';
      this.sendSubmission(dict);
    } catch (e) {
      this.submitMessage = 'Submission invalid';
    }
  }

  createResponse(totalTime: number): Array<Object> {
    let resultArray: Array<Object> = Array<Object>();
    this.labellings.controls.forEach((el: any) => {
      if (el.status != 'VALID') {
        console.log(this.labellings.controls);
        throw 'Submission invalid';
      }
      console.log(this.artifact);
      resultArray.push({
        a_id: this.artifact?.getId(),
        lt_id: el.get('labelType')?.value,
        l_id: el.get('label')?.value,
        remark: el.get('remark')?.value,
        time: totalTime,
      });
    });
    return resultArray;
  }

  async sendSubmission(dict: Object): Promise<void> {
    try {
      await this.labellingDataService.postLabelling(dict);
      this.ngOnInit();
    } catch (err) {
      this.submitMessage = 'Database error while submitting labelling.';
    }
  }
  /**
   * Error function for unimplemented features.
   */
  notImplemented(): void {
    throw new Error('This function has not been implemented yet.');
  }


  ////TO BARTGANG: idk how to get the text to be selected againnnn
    /**
   * Function is ran on mouseDown or mouseUp and updates the current selection
   * of the artifact. If the selection is null or empty, the selection is set
   * to ""
   * BROKEN
   */
  //  selectedText(): void {
  //   let hightlightedText: Selection | null = document.getSelection();
  //   //gets the start and end indices of the highlighted bit
  //   let startCharacter: number = hightlightedText?.anchorOffset!;
  //   let endCharacter: number = hightlightedText?.focusOffset!;
  //   //make sure they in the right order
  //   if (startCharacter > endCharacter) {
  //     startCharacter = hightlightedText?.focusOffset!;
  //     endCharacter = hightlightedText?.anchorOffset!;
  //   }
  //   //put into global variable
  //   this.selectionStartChar = startCharacter;
  //   this.selectionEndChar = endCharacter;
  //   //this is so the buttons still pop up, idk if we need it so ill ask bartgang
  //   if (hightlightedText == null || hightlightedText.toString().length <= 0) {
  //     this.hightlightedText = '';
  //   } else {
  //     this.hightlightedText = hightlightedText.toString();
  //   }
  // }
}
