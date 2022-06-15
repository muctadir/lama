/**
 * @author B. Henkemans
 */
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LabelingDataService } from 'app/services/labeling-data.service';
import { LabelType } from 'app/classes/label-type';
import { Label } from 'app/classes/label';
import { ReroutingService } from 'app/services/rerouting.service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-label-form',
  templateUrl: './label-form.component.html',
  styleUrls: ['./label-form.component.scss'],
})
export class LabelFormComponent implements OnInit {
  //Optional input in the form of a Label
  @Input() label?: Label;
  // Label form
  labelForm: FormGroup;
  // ROuting and url initialising
  routeService: ReroutingService;
  url: string;
  p_id: number;
  // Label types initialising
  labelTypes: Array<LabelType>;
  err: string;

  /**
   * Check the input
   * @param activeModal
   * @param labellingDataService
   * @param router
   * @param formBuilder
   */
  constructor(
    public activeModal: NgbActiveModal,
    private labellingDataService: LabelingDataService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.labelTypes = new Array<LabelType>();
    this.routeService = new ReroutingService();
    this.url = this.router.url;
    this.p_id = parseInt(this.routeService.getProjectID(this.url));
    this.labelForm = this.formBuilder.group({
      labelName: [undefined, [Validators.required, Validators.minLength(1)]],
      labelDescription: [
        undefined,
        [Validators.required, Validators.minLength(1)],
      ],
      labelTypeId: [undefined, [Validators.required]],
    });

    this.err = '';
  }

  /**
   * On init
   * 1. Get the name
   * 2. Get the description
   * 3. Get the label Type
   * 4. Disable changing label type
   */
  ngOnInit(): void {
    this.getLabelTypes();
    if (this.label !== undefined) {
      this.labelForm.controls['labelName'].patchValue(this.label.getName());
      this.labelForm.controls['labelDescription'].patchValue(
        this.label.getDesc()
      );
      this.labelForm.controls['labelTypeId'].patchValue(this.label.getType());
      this.labelForm.controls['labelTypeId'].disable();
    }
  }

  /**
   * Get the different label types
   * @param p_id
   */
  async getLabelTypes(): Promise<void> {
    const labelTypes = await this.labellingDataService.getLabelTypes(this.p_id);
    this.labelTypes = labelTypes;
  }

  /**
   * Submit the label form with the changes
   */
  submit(): void {
    if (this.label === undefined) {
      try {
        const label: Label = this.constructNewLabel();
        this.submitPostToServer(label);
      } catch (e) {
        this.err = 'Invalid Form';
      }
    } else {
      try {
        this.constructPatch();
        this.submitPatchToServer(this.label);
      } catch (e) {
        this.err = 'Invalid Form';
      }
    }
  }

  constructNewLabel(): Label {
    if (
      !this.labelForm.controls['labelName'].valid ||
      !this.labelForm.controls['labelDescription'].valid ||
      !this.labelForm.controls['labelTypeId'].valid
    ) {
      throw 'Invalid Form';
    }
    return new Label(
      0,
      this.labelForm.controls['labelName'].value,
      this.labelForm.controls['labelDescription'].value,
      ''
    );
  }

  constructPatch(): void {
    if (typeof this.label === 'undefined') {
      throw 'Patch was attempted to be constructed without a label being supplied.';
    } else if (
      !this.labelForm.controls['labelName'].valid ||
      !this.labelForm.controls['labelDescription'].valid
    ) {
      throw 'Invalid form';
    } else {
      this.label.setName(this.labelForm.controls['labelName'].value);
      this.label.setDesc(this.labelForm.controls['labelDescription'].value);
    }
  }

  /**
   * Submit the label form with the changes to server
   */
  async submitPostToServer(label: Label): Promise<void> {
    try {
      await this.labellingDataService.submitLabel(
        this.p_id,
        label,
        this.labelForm.controls['labelTypeId'].value
      );
      this.activeModal.close();
    } catch (e) {
      this.err = 'Something went wrong while submitting.';
    }
  }

  async submitPatchToServer(label: Label): Promise<void> {
    try {
      await this.labellingDataService.editLabel(
        this.p_id,
        label,
        this.labelForm.controls['labelTypeId'].value
      );
      this.activeModal.close();
    } catch (e) {
      this.err = 'Something went wrong while submitting.';
    }
  }
}
