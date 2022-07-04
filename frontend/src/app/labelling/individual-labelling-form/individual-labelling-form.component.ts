import { Component, Input, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Label } from 'app/classes/label';
import { LabelType } from 'app/classes/label-type';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, merge, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { LabellingDataService } from 'app/services/labelling-data.service';
import { ReroutingService } from 'app/services/rerouting.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-individual-labelling-form',
  templateUrl: './individual-labelling-form.component.html',
  styleUrls: ['./individual-labelling-form.component.scss'],
})
export class IndividualLabellingForm implements OnInit {
  // Inputs
  @Input() labelType?: LabelType;
  @Input() parentForm?: FormArray;
  @Input() reload?: EventEmitter<any>;

  selectedDesc: string | undefined;
  labelForm: FormGroup;

  model: any;

  labels: Array<Label> = [];
  allLabelsNames: string[] = [];

  // Implementation of the searching
  @ViewChild('instance', { static: true })
  // Create autocomplete search instance
  instance!: NgbTypeahead;
  // Listeners for different click and focus events
  click$ = new Subject<string>();
  focus$ = new Subject<string>();

  // Search on labels to be added
  searchLabel: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    // Goes through the array of labels
    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.allLabelsNames
        : this.allLabelsNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)))
    );
  }

  /**
   * Constructor which:
   * 1. Creates a label form
   */
  constructor(private formBuilder: FormBuilder,
    private labelDataService: LabellingDataService,
    private reroutingService: ReroutingService,
    private router: Router) {
    this.labelForm = this.formBuilder.group({
      labelType: [undefined, [Validators.required]],
      label: [undefined, [Validators.required]],
      remark: [undefined, [Validators.required, Validators.minLength(1)]],
    });

    this.reload?.subscribe(() => {
      this.ngOnInit();
    });
  }

  async ngOnInit(): Promise<void> {
    // Gets the data
    await this.getLabels();

    // Reset the label form
    this.labelForm.reset()
    this.selectedDesc = undefined;
    //  If the label type is undefined rerun an error
    if (typeof this.labelType === 'undefined') {
      this.selectedDesc = 'Something went wrong while getting the labels.';
    }
    //  If the parent form is undefined rerun an error
    if (typeof this.parentForm === 'undefined') {
      this.selectedDesc = 'Something went wrong while preparing the form.';
    }
    // Get the values of the label form
    this.labelForm.get('label')?.valueChanges.subscribe((val) => {
      this.labelType?.getLabels().forEach((l: Label) => {
        if (l == val) {
          this.selectedDesc = l.getDesc();
        }
      });
    });
    // Patch the values of the label form
    this.labelForm.controls['labelType'].patchValue(this.labelType);
    // Push the label form to the backend
    this.parentForm?.push(this.labelForm);
  }

  /**
   * Function to select the label from the search dropdown
   * 
   * @param item the label name clicked / entered
   */
  clickLabel(item: any): void {
    // Create a variable for the searched label
    let searchedLabel: Label | undefined;
    // For all labels, get the correct one
    for (let label of this.labels) {
      if (label.getName() == item.item) {
        // Asign the searched label
        searchedLabel = label;
      }
    }
    // If the label exists
    if (searchedLabel != undefined) {
      // We set the form value to this label
      this.labelForm.controls['label'].setValue(searchedLabel)
      this.selectedDesc = searchedLabel.getDesc()
    }
  }

  /**
   * Function to get all labels in the project
   * Also gets the names of all labels
   */
  async getLabels(): Promise<void> {
    // Get the ptoject id
    let p_id = this.reroutingService.getProjectID(this.router.url);
    // Get the labels
    let labels = await this.labelDataService.getLabelTypesWithLabels(parseInt(p_id));

    // Recursion of some sort
    for (let label of labels) {
      if (label.getId() == this.labelType?.getId()) {
        this.labels = label.getLabels();
      }
    }

    // Get all label names
    this.allLabelsNames = [];
    for (let label of this.labels) {
      this.allLabelsNames.push(label.getName());
    }
  }

}
