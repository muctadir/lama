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
      labellings: this.labellings

    });
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
     * TODO: If any of this fails we should probably deal with it
     */
    this.getRandomArtifact(this.p_id);
    this.getLabelTypesWithLabels(this.p_id);
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
  async getRandomArtifact(p_id: number): Promise<void> {
    const artifact = await this.artifactDataService.getRandomArtifact(p_id);
    this.artifact = artifact;

    const labellers = await this.artifactDataService.getLabellers(p_id, artifact.getId());
    this.labellers = labellers;
  }

  /**
   * Function for getting the label and labeltypes
   * @param p_id
   */
  async getLabelTypesWithLabels(p_id: number): Promise<void> {
    const labelTypes = await this.labellingDataService.getLabelTypesWithLabels(p_id);
    this.labelTypes = labelTypes;
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
   *
   */
  submit() : void {
    let p_id = this.routeService.getProjectID(this.url);
    let resultArray: Array<Object> = Array<Object>();

    this.labellings.controls.forEach((el: any) => {
      resultArray.push({
        'a_id': this.artifact?.getId(),
        'lt_id': el.get('labelType')?.value,
        'l_id': el.get('label')?.value,
        'remark': el.get('remark')?.value
      });
    });

    const dict = {
      'p_id': parseInt(p_id),
      "resultArray": resultArray,
    }
    console.log(dict)
    this.labellingDataService.postLabelling(dict);
  }

  /**
   * Error function for unimplemented features.
   */
  notImplemented(): void {
    throw new Error('This function has not been implemented yet.');
  }
}
