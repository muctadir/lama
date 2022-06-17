// Author: Victoria Bogachenkova, Thea Bradley
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MergeLabelFormComponent } from 'app/modals/merge-label-form/merge-label-form.component';
import { LabelingDataService } from 'app/services/labeling-data.service';
import { Label } from 'app/classes/label';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/services/rerouting.service';
import { LabelFormComponent } from 'app/modals/label-form/label-form.component';
import { FormBuilder } from '@angular/forms';

// Enumeration for sorting 
enum sorted {
  Not = 0, // Not sorted
  Asc = 1, // Sorted in ascending order
  Des = 2 // Sorted in descending order
}

@Component({
  selector: 'app-label-management',
  templateUrl: './label-management.component.html',
  styleUrls: ['./label-management.component.scss']
})
export class LabelManagementComponent {
  routeService: ReroutingService;
  url: string;
  labels: Array<Label>;

  //Pagination Settings
  page: number = 1;
  pageSize: number = 10;

  //Variables for sorting - all are not sorted
  sortedLabel = sorted.Not; // Label name
  sortedLabelType = sorted.Not; // Label Type 
  sortedNOA = sorted.Not; // Number of artifacts

  // Text from the search bar
  searchForm = this.formBuilder.group({
    search_term: ''
  });

// Contructor with modal
  constructor(private modalService: NgbModal,
    private labelingDataService: LabelingDataService,
    private router: Router,
    private formBuilder: FormBuilder) {
      this.routeService = new ReroutingService();
      this.url = this.router.url;
      this.labels = new Array<Label>();
  }

  ngOnInit(): void {
    const p_id = parseInt(this.routeService.getProjectID(this.url));
    this.getLabels(p_id);
  }

  // Open the modal and merge lables
  openMerge() {
    const modalRef = this.modalService.open(MergeLabelFormComponent,  { size: 'xl'});
  }

  // Open the modal and create a new label
  openCreate() {
    const modalRef = this.modalService.open(LabelFormComponent, { size: 'xl'});
  }

  async getLabels(p_id: number): Promise<void> {
    const labels = await this.labelingDataService.getLabels(p_id);
    this.labels = labels;
  }

  /**
   * Gets the project id from the URL and reroutes to the single label page
   * of the same project
   *
   * @trigger click on label
   */
  reRouter(label_id: number) : void {
    // Use reroutingService to obtain the project ID
    let p_id = this.routeService.getProjectID(this.url);

    // Changes the route accordingly
    this.router.navigate(['/project', p_id, 'singlelabel', label_id]);
  }

  //gets the search text
  onEnter() {
    var text = this.searchForm.value.search_term
    alert("entered!!"+ text + "");
  }

  /**
   * Function for sorting on name
   * 
  */
  sortLabel(){
    // Check if it was sorted ascending
    if (this.sortedLabel == sorted.Asc){
      // Make the sorted enum descending
      this.sortedLabel = sorted.Des;
      // Sort the array
      this.labels.sort((a,b) => b.getName().localeCompare(a.getName()));
    // Check if it was sorted descending or not yet
    } else if (this.sortedLabel == sorted.Des || this.sortedLabel == sorted.Not){
      // Make the sorted enum ascending
      this.sortedLabel = sorted.Asc;
      // Sort the array
      this.labels.sort((a,b) => a.getName().localeCompare(b.getName()));
    }
    // Set other sorts to not sorted
    this.sortedLabelType = sorted.Not;
    this.sortedNOA = sorted.Not
  }

  /**
   * Function for sorting on label type
   * 
  */
  sortLabelType(){
    // Check if it was sorted ascending
    if (this.sortedLabelType == sorted.Asc){
      // Make the sorted enum descending
      this.sortedLabelType = sorted.Des;
      // Sort the array
      this.labels.sort((a,b) => b.getType().localeCompare(a.getType()));
    // Check if it was sorted descending or not yet
    } else if (this.sortedLabelType == sorted.Des || this.sortedLabelType == sorted.Not){
      // Make the sorted enum ascending
      this.sortedLabelType = sorted.Asc;
      // Sort the array
      this.labels.sort((a,b) => a.getType().localeCompare(b.getType()));
    }
    // Set other sorts to not sorted
    this.sortedLabel = sorted.Not;
    this.sortedNOA = sorted.Not
  }

  /**
   * Function for sorting on number of artifacts
   * 
  */
  sortNumberOfArtifacts(){
    // Check if it was sorted ascending
    if (this.sortedNOA == sorted.Asc){
      // Make the sorted enum descending
      this.sortedNOA = sorted.Des;
      // Sort the array
      this.labels.sort((a,b) => a.getNumberOfArtifacts() - b.getNumberOfArtifacts());
    // Check if it was sorted descending or not yet
    } else if (this.sortedNOA == sorted.Des || this.sortedNOA == sorted.Not){
      // Make the sorted enum ascending
      this.sortedNOA = sorted.Asc;
      // Sort the array
      this.labels.sort((a,b) => b.getNumberOfArtifacts() - a.getNumberOfArtifacts());
    }
    // Set other sorts to not sorted
    this.sortedLabel = sorted.Not;
    this.sortedLabelType = sorted.Not
  }
}
