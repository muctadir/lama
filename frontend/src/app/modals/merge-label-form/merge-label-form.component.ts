import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LabelingDataService } from 'app/services/labeling-data.service';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/services/rerouting.service';
import { Label } from 'app/classes/label';
import { LabelType } from 'app/classes/label-type';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-merge-label-form',
  templateUrl: './merge-label-form.component.html',
  styleUrls: ['./merge-label-form.component.scss'],
})
export class MergeLabelFormComponent {
  routeService: ReroutingService;
  url: string;
  labelTypes: Array<LabelType>;
  form: FormGroup;
  p_id: number;
  availableLabels: Array<Label>;
  formArray: FormArray;
  used = new Array<Label>();
  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private labelingDataService: LabelingDataService,
    private formBuilder: FormBuilder
  ) {
    this.labelTypes = new Array<LabelType>();
    this.formArray = this.formBuilder.array([]);
    this.routeService = new ReroutingService();
    this.url = this.router.url;
    this.form = this.formBuilder.group({
      labelType: [undefined],
      toBeMergedLabels: this.formArray,
      mergerName: [undefined],
      mergerDescription: [undefined],
    });
    this.p_id = parseInt(this.routeService.getProjectID(this.url));
    this.availableLabels = new Array<Label>();
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
    this.getLabels();
    this.form.get('labelType')?.valueChanges.subscribe((l: LabelType) => {
      this.form.controls['toBeMergedLabels'].reset();
      this.availableLabels = l.getLabels();
    });

    this.form.get('toBeMergedLabels')?.valueChanges.subscribe((c) => {
      let used = new Array<Label>();
      c.forEach((obj: any) => {
        used.push(obj.label);
      });
      this.used = used;
    });
  }

  async getLabels(): Promise<void> {
    try {
      const result = await this.labelingDataService.getLabelTypesWithLabels(
        this.p_id
      );
      this.labelTypes = result;
    } catch (e) {
      console.log(e);
    }
  }

  add(): void {
    const labelForm = this.formBuilder.group({
      label: [undefined, Validators.required],
    });
    this.toBeMergedLabels.push(labelForm);
  }

  rem(i: number): void {
    this.toBeMergedLabels.removeAt(i);
  }

  async submit(): Promise<void> {
    if (this.toBeMergedLabels.length !== 2) {
      throw new Error(
        `Sorry, currently only merging of two labels is supported. ${this.toBeMergedLabels.length} !== 2`
      );
    }
    const arrayResult = this.form.get('toBeMergedLabels')?.value;

    try {
      await this.labelingDataService.postMerge({
        'leftLabelId': arrayResult[0].label.getId(),
        'rightLabelId': arrayResult[1].label.getId(),
        'newLabelName': this.form.get('mergerName')?.value,
        'newLabelDescription': this.form.get('mergerName')?.value,
        'p_id': this.p_id
      });
      this.activeModal.close()
    } catch (e) {
      console.log(e);
    }


  }

  notImplemented() {}
}
