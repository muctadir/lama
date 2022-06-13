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
    this.getRandomArtifact();
    this.getLabelTypesWithLabels();
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
    try {
      let resultArray: Array<Object> = this.createResponse();
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

  createResponse(): Array<Object> {
    let resultArray: Array<Object> = Array<Object>();

    this.labellings.controls.forEach((el: any) => {
      if (el.status != 'VALID') {
        throw 'Submission invalid';
      }
      resultArray.push({
        a_id: this.artifact?.getId(),
        lt_id: el.get('labelType')?.value,
        l_id: el.get('label')?.value,
        remark: el.get('remark')?.value,
      });
    });
    return resultArray;
  }

  async sendSubmission(dict: Object): Promise<void> {
    try {
      await this.labellingDataService.postLabelling(dict);
      this.ngOnInit();
    } catch (err) {
      this.router.navigate(['project', this.p_id]);
    }
  }
  /**
   * Error function for unimplemented features.
   */
  notImplemented(): void {
    throw new Error('This function has not been implemented yet.');
  }
}
