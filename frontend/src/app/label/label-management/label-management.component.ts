// Author: Victoria Bogachenkova, Thea Bradley
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MergeLabelFormComponent } from 'app/modals/merge-label-form/merge-label-form.component';
import { LabellingDataService } from 'app/services/labeling-data.service';
import { Label } from 'app/classes/label';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/services/rerouting.service';
import { LabelFormComponent } from 'app/modals/label-form/label-form.component';
import { FormBuilder } from '@angular/forms';

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

  //text from the search bar
  searchForm = this.formBuilder.group({
    search_term: ''
  });

// Contructor with modal
  constructor(private modalService: NgbModal,
    private labelingDataService: LabellingDataService,
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
}
