/**
 * Author: Victoria Bogachenkova
 * Author: Bartjan Henkemans
 */
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LabellingDataService } from 'app/services/labelling-data.service';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/services/rerouting.service';
import { Label } from 'app/classes/label';
import { Theme } from 'app/classes/theme';
import { LabelFormComponent } from 'app/modals/label-form/label-form.component';

@Component({
  selector: 'app-individual-label',
  templateUrl: './individual-label.component.html',
  styleUrls: ['./individual-label.component.scss'],
})
export class IndividualLabelComponent {
  routeService: ReroutingService;
  label: Label;
  url: string;
  labellings: Array<any>;
  themes: Array<Theme>;
  p_id: number;
  label_id: number;
  labelCount: number;
  /**
   * Constructor which:
   * 1. makes an empty label
   * 2. get routerService
   * 3. get url
   * 4. initialize labellings variable
   * 5. initialize themes variable
   * 6. get project id
   * 7. get label id
   */
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private labellingDataService: LabellingDataService
  ) {
    this.label = new Label(-1, '', '', '');
    this.routeService = new ReroutingService();
    this.url = this.router.url;
    this.labellings = new Array<any>();
    this.themes = new Array<Theme>();
    this.p_id = parseInt(this.routeService.getProjectID(this.url));
    this.label_id = parseInt(this.routeService.getLabelID(this.url));
    this.labelCount = 1; // initialize as 1 so that if something goes wrong the delete button does not show up
  }

  /**
   * OnInit,
   * 1. Get label
   * 2. Get labelling
   */
  ngOnInit(): void {
    this.getLabel(this.p_id, this.label_id);
    this.getLabellings(this.p_id, this.label_id);
    this.getLabellingAmount();
  }

  /**
   * Async function which gets the label
   */
  async getLabel(p_id: number, labelID: number): Promise<void> {
    try {
      // Get label through labelling service
      const label = await this.labellingDataService.getLabel(p_id, labelID);
      // Assign it to local variable label
      this.label = label;
    } catch (e) {
      // If something goes wrong navigate away to the projects page
      this.router.navigate(['project', this.p_id]);
    }
    try {
      // Get themes
      const themes = this.label.getThemes();
      if (themes !== undefined) {
        this.themes = themes;
      }
    } catch (e) {
      // If something goes wrong navigate away to the projects page
      this.router.navigate(['project', this.p_id]);
    }
  }
  /**
   * Async function which gets labellings
   * @param p_id 
   * @param labelID 
   */
  async getLabellings(p_id: number, labelID: number): Promise<void> {
    try {
      // Get labelling from the labelling service
      const labellings = await this.labellingDataService.getLabelling(
        p_id,
        labelID
      );
      this.labellings = labellings;
    } catch (edit) {
      // If something goes wrong navigate away to the projects page
      this.router.navigate(['project', this.p_id]);
    }
  }

  /**
   * Post of the soft delete
   */
  async postSoftDelete() {
    try{
      // Post the soft delete
      await this.labellingDataService.postSoftDelete({
        'p_id': this.p_id,
        'l_id': this.label_id
      });
      // Navigate to the label management page
      this.router.navigate(['project', this.p_id, 'labelmanagement']);
    } catch (e) {
      console.log("Something went wrong!")
      // Navigate to the project page
      this.router.navigate(['project', this.p_id]);
    }
  }

  /**
   * Gets the project id from the URL and reroutes to the label management page
   * of the same project
   *
   * @trigger back button is pressed
   */
  reRouter(): void {
    // Changes the route accordingly
    this.router.navigate(['/project', this.p_id, 'labelmanagement']);
  }

  /**
   * Opens modal to edit label
   */
  openEdit() {
    // Open the modal
    const modalRef = this.modalService.open(LabelFormComponent, { size: 'xl' });
    // Get the label from the modal
    modalRef.componentInstance.label = this.label;
    modalRef.result.then(() => {
      // Refresh the contents of the page
      this.ngOnInit();
    });
  }
  async getLabellingAmount(): Promise<void> {
    try {
      const result = await this.labellingDataService.getLabellingCount({
        p_id: this.p_id,
        l_id: this.label_id
      });
      this.labelCount = parseInt(result);
    } catch (e) {
      console.error(e);
    }
  }
}
