// <!-- Author: Victoria Bogachenkova -->
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CreateLabelFormComponent } from '../create-label-form/create-label-form.component';
import { MergeLabelFormComponent } from '../merge-label-form/merge-label-form.component';
import { LabelingDataService } from '../labeling-data.service';
import { Label } from '../label';
import { LabelType } from '../label-type'; 

import { Router } from '@angular/router';
import { ReroutingService } from 'app/rerouting.service';

@Component({
  selector: 'app-label-management',
  templateUrl: './label-management.component.html',
  styleUrls: ['./label-management.component.scss']
})
export class LabelManagementComponent {
  //Pagination Settings
  labels: Array<Label> = new Array<Label>();
  p_id: number = 1;
  page: number = 1;
  pageSize: number = 4;
  projectId: number = 1; // hardcoded TODO: Change
  
  
// Contructor with modal
  constructor(private modalService: NgbModal,
    private labelingDataService: LabelingDataService,
    private router: Router) {}
    
  ngOnInit(): void { 
    this.getLabels();
  }
  // Open the modal and merge lables
  openMerge() {
    const modalRef = this.modalService.open(MergeLabelFormComponent,  { size: 'xl'});
  }

  // Open the modal and create a new label
  openCreate() {
    const modalRef = this.modalService.open(CreateLabelFormComponent, { size: 'xl'});
  }

  async getLabels(): Promise<void> {
    const labels = await this.labelingDataService.getLabels(this.p_id);
    this.labels = labels;
  }
  
  /**
   * Gets the project id from the URL and reroutes to the single label page
   * of the same project
   * 
   * @trigger click on label
   */
   reRouter() : void {
    // Gets the url from the router
    let url: string = this.router.url
    
    // Initialize the ReroutingService
    let routeService: ReroutingService = new ReroutingService();
    // Use reroutingService to obtain the project ID
    let p_id = routeService.getProjectID(url);
    
    // Changes the route accordingly
    this.router.navigate(['/project', p_id, 'singlelabel']);
  }

}
