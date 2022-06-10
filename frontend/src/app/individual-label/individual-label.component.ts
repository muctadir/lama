/**
 * Author: Victoria Bogachenkova
 * Author: Bartjan Henkemans
 */
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LabellingDataService } from '../labelling-data.service';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/rerouting.service';
import { Label } from 'app/classes/label';
import { LabelFormComponent } from 'app/label-form/label-form.component';
import { Theme } from 'app/classes/theme'

@Component({
  selector: 'app-individual-label',
  templateUrl: './individual-label.component.html',
  styleUrls: ['./individual-label.component.scss']
})
export class IndividualLabelComponent {
  routeService: ReroutingService;
  label: Label;
  url: string;
  labellings: any;
  themes: Array<Theme>;

  /**
   * Constructor which:
   * 1. makes an empty label
   * 2. get routerService
   * 3. get url
   * 4. initialize labellings variable
   */
  constructor(private modalService: NgbModal,
    private router: Router,
    private labellingDataService: LabellingDataService) {
      this.label = new Label(-1,"","","");
      this.routeService = new ReroutingService();
      this.url = this.router.url;
      this.labellings = {};
      this.themes = new Array<Theme>();
  }

  /**
   * OnInit,
   *  1. the p_id of the project is retrieved
   *  2. the labelId of the label is retrieved
   *  3. the label loading is started
   */
  ngOnInit(): void {
    let p_id = parseInt(this.routeService.getProjectID(this.url));
    let labelID = parseInt(this.routeService.getLabelID(this.url));
    this.getLabel(p_id, labelID);
    this.getLabellings(p_id, labelID);
  }

  /**
   * Async function which gets the label
   */
  async getLabel(p_id: number, labelID: number): Promise<void> {
    const label = await this.labellingDataService.getLabel(p_id, labelID);
    this.label = label;
    const themes = this.label.getThemes()
    if (themes !== undefined) {
      this.themes = themes;
    }
  }

  async getLabellings(p_id: number, labelID: number): Promise<void> {
    const labellings = await this.labellingDataService.getLabelling(p_id, labelID);
    this.labellings = labellings;
  }

  /**
   * Gets the project id from the URL and reroutes to the label management page
   * of the same project
   *
   * @trigger back button is pressed
   */
  reRouter() : void {
    // Use reroutingService to obtain the project ID
    let p_id = this.routeService.getProjectID(this.url);

    // Changes the route accordingly
    this.router.navigate(['/project', p_id, 'labelmanagement']);
  }

  /**
   * Opens modal to edit label
   */
  openEdit() {
    const modalRef = this.modalService.open(LabelFormComponent,  { size: 'xl'});
    modalRef.componentInstance.label = this.label;
  }


}
