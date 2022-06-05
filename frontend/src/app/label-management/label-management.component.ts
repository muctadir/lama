// <!-- Author: Victoria Bogachenkova -->
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MergeLabelFormComponent } from '../merge-label-form/merge-label-form.component';
import { LabelingDataService } from '../labeling-data.service';
import { Label } from 'app/classes/label';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/rerouting.service';
import { LabelFormComponent } from 'app/label-form/label-form.component';

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
  pageSize: number = 4;

// Contructor with modal
  constructor(private modalService: NgbModal,
    private labelingDataService: LabelingDataService,
    private router: Router) {
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
}
