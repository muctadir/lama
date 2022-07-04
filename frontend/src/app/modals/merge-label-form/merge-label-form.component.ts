import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LabellingDataService } from 'app/services/labelling-data.service';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/services/rerouting.service';
import { Label } from 'app/classes/label';
import { LabelType } from 'app/classes/label-type';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastCommService } from 'app/services/toast-comm.service';

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

  /**
   * Constuctor
   * @param activeModal 
   * @param router 
   * @param labellingDataService 
   * @param formBuilder 
   * 
   * 1. creates labels types array
   * 2. creates forms array
   * 3. gets router service
   * 4. gets url
   * 5. creates form
   * 6. gets project id
   * 7. creates avaliable labels array
   */
  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private labellingDataService: LabellingDataService,
    private toastCommService: ToastCommService,
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

  // Gets the ,erged labels
  get toBeMergedLabels(): FormArray {
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

  // Gets labels
  async getLabels(): Promise<void> {
    try {
      // Wait for get label types with labels
      const result = await this.labellingDataService.getLabelTypesWithLabels(
        this.p_id
      );
      this.labelTypes = result;
    } catch (e) {
      this.toastCommService.emitChange([false, "Something went wrong when trying to supply the labels"])
    }
  }

  // Add to form
  add(): void {
    const labelForm = this.formBuilder.group({
      label: [undefined, Validators.required],
    });
    this.toBeMergedLabels.push(labelForm);
  }

  // Remove from form
  rem(i: number): void {
    this.toBeMergedLabels.removeAt(i);
  }

  // Submit form
  async submit(): Promise<void> {
    // Check you are merging two or more labels
    if (this.toBeMergedLabels.length < 2) {
      this.toastCommService.emitChange([false, "Please select two or more labels to merge"]);
      return
    }

    // Puts the labels to be merged in array
    const arrayResult: [Record<string, Label>] = this.form.get('toBeMergedLabels')?.value;

    // Check is the arrayResult is not null
    if (arrayResult != null){
      // Check if the label forms were filled in
      for (let label of arrayResult){
        // If a label form was not filled in
        if (label['label'] == null){
          // Return a toast error message
          this.toastCommService.emitChange([false, "Please fill in all label forms"]);
          return
        }
      }
    } 

    // Get the ids of the labels to be merged
    const mergedLabels = arrayResult?.map(result => result['label'].getId());

    try {
      // Wait for the posting of the merging
      let response = await this.labellingDataService.postMerge({
        'mergedLabels': mergedLabels,
        'newLabelName': this.form.get('mergerName')?.value,
        'newLabelDescription': this.form.get('mergerDescription')?.value,
        'labelTypeName': this.form.get('labelType')?.value.getName(),
        'p_id': this.p_id
      });
      // Make toast signalling whether the merging was successful or not
      if (response == "Success") {
        this.toastCommService.emitChange([true, "Labels merged successfully"])
        // Close modal
        this.activeModal.close()
      }
      else {
        this.toastCommService.emitChange([false, response])
      }
    } catch (e:any) {
      // Throw error
      this.toastCommService.emitChange([false, e.response.data]);
    }
  }

}
