/**
 * @author Bartjan Henkemans
 * @author Victoria Boganchenkova
 */
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  NgbModal,
  NgbActiveModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { MergeLabelFormComponent } from 'app/modals/merge-label-form/merge-label-form.component';
import { LabellingDataService } from 'app/services/labelling-data.service';
import { Label } from 'app/classes/label';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/services/rerouting.service';
import { LabelFormComponent } from 'app/modals/label-form/label-form.component';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-label-management',
  templateUrl: './label-management.component.html',
  styleUrls: ['./label-management.component.scss'],
})
export class LabelManagementComponent {
  routeService: ReroutingService;
  p_id: number;
  url: string;
  labels: Array<Label>;
  labelAmount: { [id: number]: string };

  //Pagination Settings
  page: number;
  pageSize: number;

  // Text from the search bar
  searchForm = this.formBuilder.group({
    search_term: '',
  });

  /**
   * Constructor which:
   * 1. get routerService
   * 2. get url
   * 3. get project if
   * 4. initialize labels variable
   * 5. initialize label amount variable
   * 6. set page
   * 7. set page size
   */
  constructor(
    private modalService: NgbModal,
    private labellingDataService: LabellingDataService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.routeService = new ReroutingService();
    this.url = this.router.url;
    this.p_id = parseInt(this.routeService.getProjectID(this.url));
    this.labels = new Array<Label>();
    this.labelAmount = {};
    this.page = 1;
    this.pageSize = 10;
  }

  ngOnInit(): void {
    this.getLabels();
    // this.getLabelledCount();
  }

  // Open the modal and merge lables
  openMerge() {
    const modalRef = this.modalService.open(MergeLabelFormComponent, {
      size: 'xl',
    });
    modalRef.result.then(() => {
      this.ngOnInit();
    });
  }

  // Open the modal and create a new label
  openCreate() {
    const modalRef = this.modalService.open(LabelFormComponent, { size: 'xl' });
    modalRef.result.then(() => {
      this.ngOnInit();
    });
  }

  /**
   * Get labels
   */
  async getLabels(): Promise<void> {
    try {
      // Get labels from the labelling data service
      const labels = await this.labellingDataService.getLabels(this.p_id);
      this.labels = labels;
      // Get label count
      this.getLabelledCount();
    } catch (e) {
      // Navigate to project page
      this.router.navigate(['project', this.p_id]);
    }
  }

  /**
   * Gets the project id from the URL and reroutes to the single label page
   * of the same project
   *
   * @trigger click on label
   */
  reRouter(label_id: number): void {
    // Changes the route accordingly
    this.router.navigate(['/project', this.p_id, 'singlelabel', label_id]);
  }

  // Gets the search text
  onEnter() {
    var text = this.searchForm.value.search_term;
    alert('entered!!' + text + '');
  }

  // Get the labelled count
  async getLabelledCount(): Promise<void> {
    // Result dictionary
    let resultDict: { [id: number]: string } = {};


    await this.labels.forEach(async (label: Label) => {
      // Wait for the laeblling data service to get the labelling count
      const result = await this.labellingDataService.getLabellingCount({
        p_id: this.p_id,
        l_id: label.getId(),
      });
      // Fill in the result dictionary
      resultDict[label.getId()] = result;
    });
    // Set the result equal to the label amount variable
    this.labelAmount = resultDict;
  }
}
