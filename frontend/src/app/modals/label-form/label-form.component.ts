/**
 * @author B. Henkemans
 */
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LabellingDataService } from 'app/services/labelling-data.service';
import { LabelType } from 'app/classes/label-type';
import { Label } from 'app/classes/label';
import { ReroutingService } from 'app/services/rerouting.service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ToastCommService } from 'app/services/toast-comm.service';

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
  // Routing and url initialising
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
    private labellingDataService: LabellingDataService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastCommService: ToastCommService
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
    // Wait for the label types
    const labelTypes = await this.labellingDataService.getLabelTypes(this.p_id);
    this.labelTypes = labelTypes;
  }

  /**
   * Submit the label form with the changes
   */
  submit(): void {
    if (this.label === undefined) {
      try {
        // Create a new label
        const label: Label = this.constructNewLabel();
        // Submit label to the server
        this.submitPostToServer(label);
      } catch (e) {
        // Throw error
        this.toastCommService.emitChange([false, "Invalid Input"]);
      }
    } else {
      try {
        // Construct a patch for the label
        this.constructPatch();
        // Submit the patch to the label
        this.submitPatchToServer(this.label);
      } catch (e) {
        // Throw error
        this.toastCommService.emitChange([false, "Invalid Input"]);
      }
    }
  }

  /**
   * Construct a new label
   * 
   */
  constructNewLabel(): Label {
    // Check validity
    if (
      !this.labelForm.controls['labelName'].valid ||
      !this.labelForm.controls['labelDescription'].valid ||
      !this.labelForm.controls['labelTypeId'].valid
    ) {
      // Throw error
      throw 'Invalid Form';
    }
    // Return new label
    return new Label(
      0,
      this.labelForm.controls['labelName'].value,
      this.labelForm.controls['labelDescription'].value,
      ''
    );
  }

  /**
   * Construct patch
   */
  constructPatch(): void {
    // CHeck label undefined
    if (typeof this.label === 'undefined') {
      throw 'Patch was attempted to be constructed without a label being supplied.';
    } else if (
      // Check validity
      !this.labelForm.controls['labelName'].valid ||
      !this.labelForm.controls['labelDescription'].valid
    ) {
      // Throw error
      throw 'Invalid form';
    } else {
      // Change name and/pr description
      this.label.setName(this.labelForm.controls['labelName'].value);
      this.label.setDesc(this.labelForm.controls['labelDescription'].value);
    }
  }

  /**
   * Submit the label form with the changes to server
   */
  async submitPostToServer(label: Label): Promise<void> {
    try {
      // Wait for submit label
      await this.labellingDataService.submitLabel(
        this.p_id,
        label,
        this.labelForm.controls['labelTypeId'].value
      );
      // Show success toast
      this.toastCommService.emitChange([true, "Label created successfully"]);
      // Close modal
      this.activeModal.close();
    } catch (e: any) {
      // Check if the error has invalid characters
      if(e.response.status == 511){
        // Displays the error message
        this.toastCommService.emitChange([false, "Input contains a forbidden character: \\ ; , or #"]);
      } else if (e.response.data == "Input contains leading or trailing whitespaces") {
        // Displays the error message
        this.toastCommService.emitChange([false, "Input contains leading or trailing whitespaces"]);
      } else {
      // Throw error
      this.toastCommService.emitChange([false, "Something went wrong while submitting."]);
      }
    }
  }

  /**
   * Submit new patch to the server
   * @param label 
   */
  async submitPatchToServer(label: Label): Promise<void> {
    try {
      // Wait for edit label
      await this.labellingDataService.editLabel(
        this.p_id,
        label,
        this.labelForm.controls['labelTypeId'].value
      );
      // Close modal
      this.activeModal.close();
      this.toastCommService.emitChange([true, "Edited label successfully"]);
    } catch (e) {
      // Throw error
      this.toastCommService.emitChange([false, "Something went wrong while submitting."]);
    }
  }
}
