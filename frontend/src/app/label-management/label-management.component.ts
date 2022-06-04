// <!-- Author: Victoria Bogachenkova -->
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CreateLabelFormComponent } from '../create-label-form/create-label-form.component';
import { MergeLabelFormComponent } from '../merge-label-form/merge-label-form.component';
import { LabelingDataService } from '../labeling-data.service';
import { Label } from '../label';
import { LabelType } from '../label-type'; 

@Component({
  selector: 'app-label-management',
  templateUrl: './label-management.component.html',
  styleUrls: ['./label-management.component.scss']
})
export class LabelManagementComponent implements OnInit {
  //Pagination Settings
  labels: Array<Label> = new Array<Label>();
  p_id: number = 2;
  page: number = 1;
  pageSize: number = 4;
  projectId: number = 1; // hardcoded TODO: Change
  
  
// Contructor with modal
  constructor(private modalService: NgbModal,
    private labelingDataService: LabelingDataService) {}
    
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
    const labels = await this.labelingDataService.getLabels(2);
    this.labels = labels;
  }

}
