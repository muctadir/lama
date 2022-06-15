import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LabelingDataService } from 'app/services/labeling-data.service';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/services/rerouting.service';
import { Label } from 'app/classes/label';
import { LabelType } from 'app/classes/label-type';
import { Form, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-merge-label-form',
  templateUrl: './merge-label-form.component.html',
  styleUrls: ['./merge-label-form.component.scss'],
})
export class MergeLabelFormComponent {
  routeService: ReroutingService;
  labels: Array<Label>;
  url: string;
  labelTypes: Array<LabelType>;
  form: FormGroup;
  p_id: number;
  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private labelingDataService: LabelingDataService,
    private formBuilder: FormBuilder
  ) {
    this.labels = new Array<Label>();
    this.labelTypes = new Array<LabelType>();
    this.routeService = new ReroutingService();
    this.url = this.router.url;
    this.form = this.formBuilder.group({
      toBeMergedLabels: this.formBuilder.array([]),
    });
    this.p_id = parseInt(this.routeService.getProjectID(this.url));
  }

  get toBeMergedLabels() {
    return this.form.controls['toBeMergedLabels'] as FormArray;
  }
  /**
   * OnInit,
   *  1. the p_id of the project is retrieved
   *  2. the labelId of the label is retrieved
   *  3. the label loading is started
   */
  ngOnInit(): void {
    this.getLabels(this.p_id);
    this.getLabelTypes(this.p_id);
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

  add(): void {
    const labelForm = this.formBuilder.group({
      label: [undefined, Validators.required]
    });
    this.toBeMergedLabels.push(labelForm);
  }

  rem(i: number): void {
    this.toBeMergedLabels.removeAt(i);
  }
  // Not implemented function
  notImplemented() {
    alert('Not implemented');
  }
}
