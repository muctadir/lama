/**
 * @author Bartjan Henkemans
 * @author Victoria Boganchenkova
 */
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MergeLabelFormComponent } from '../merge-label-form/merge-label-form.component';
import { LabellingDataService } from '../labelling-data.service';
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
  p_id: number;
  url: string;
  labels: Array<Label>;

  //Pagination Settings
  page: number;
  pageSize: number;

// Contructor with modal
  constructor(private modalService: NgbModal,
    private labellingDataService: LabellingDataService,
    private router: Router) {
      this.routeService = new ReroutingService();
      this.url = this.router.url;
      this.p_id = parseInt(this.routeService.getProjectID(this.url));
      this.labels = new Array<Label>();
      this.page = 1;
      this.pageSize = 10;
  }

  ngOnInit(): void {
    this.getLabels();
  }

  // Open the modal and merge lables
  openMerge() {
    const modalRef = this.modalService.open(MergeLabelFormComponent,  { size: 'xl'});
    modalRef.result.then(() => {
      this.ngOnInit();
    });
  }

  // Open the modal and create a new label
  openCreate() {
    const modalRef = this.modalService.open(LabelFormComponent, { size: 'xl'});
    modalRef.result.then(() => {
      this.ngOnInit();
    });
  }

  async getLabels(): Promise<void> {
    try {
      const labels = await this.labellingDataService.getLabels(this.p_id);
      this.labels = labels;
    } catch (e) {
      this.router.navigate(['project', this.p_id]);
    }
  }

  /**
   * Gets the project id from the URL and reroutes to the single label page
   * of the same project
   *
   * @trigger click on label
   */
  reRouter(label_id: number) : void {
    // Changes the route accordingly
    this.router.navigate(['/project', this.p_id, 'singlelabel', label_id]);
  }
}
