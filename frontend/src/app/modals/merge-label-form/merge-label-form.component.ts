import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LabelingDataService } from 'app/services/labeling-data.service';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/services/rerouting.service';
import { Label } from 'app/classes/label';
import { Labelling } from 'app/classes/labelling';
import { LabelType } from 'app/classes/label-type';

// // Tyep for label
// type label = {
//   labelId: Number,
//   labelName: String,
//   labelDescription: String,
//   labelType: String
// }

@Component({
  selector: 'app-merge-label-form',
  templateUrl: './merge-label-form.component.html',
  styleUrls: ['./merge-label-form.component.scss']
})
export class MergeLabelFormComponent {
  routeService: ReroutingService;
  labels: Array<Label>;
  url: string;
  labelTypes: Array<LabelType>

  /**
   * Constructor which:
   * 1. makes an empty label
   * 2.
   */
   constructor(public activeModal: NgbActiveModal,
    private router: Router,
    private labelingDataService: LabelingDataService) {
      this.labels = new Array<Label>();
      this.labelTypes = new Array<LabelType>();
      this.routeService = new ReroutingService();
      this.url = this.router.url;
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
    this.getLabels(p_id);
    this.getLabelTypes(p_id);
  }

  /**
   * Async function which gets the label
   */
   async getLabels(p_id: number): Promise<void> {
    const labels = await this.labelingDataService.getLabels(p_id);
    this.labels = labels;
  }

  /**
   * Async get labelTypes
   * @param p_id
   */
  async getLabelTypes(p_id: number): Promise<void> {
    const labelTypes = await this.labelingDataService.getLabelTypes(p_id);
    this.labelTypes = labelTypes;
    console.log(labelTypes);
  }

  // Not implemented function
  notImplemented() {
    alert("Not implemented");
  }

}
