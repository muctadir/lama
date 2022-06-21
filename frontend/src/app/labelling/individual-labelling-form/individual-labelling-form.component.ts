import { Component, Input, OnInit, Output, ViewChild  } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Label } from 'app/classes/label';
import { LabelType } from 'app/classes/label-type';
import { EventEmitter } from '@angular/core';
import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {Observable, Subject, merge, OperatorFunction} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';

const test = ["soup", "sour", "ass"]

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
  selectedLabel : Label | undefined;

  // Form for label search function
  labelSearch = this.formBuilder.group({
    labelSearch: ""
  });

  model: any;


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
      map(term => (term === '' ? test
        : test.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }

  /**
   * Constructor which:
   * 1. Creates a label form
   */
  constructor(private formBuilder: FormBuilder) {
    this.labelForm = this.formBuilder.group({
      labelType: [undefined, [Validators.required]],
      label: [undefined, [Validators.required]],
      remark: [undefined, [Validators.required, Validators.minLength(1)]],
    });

    this.reload?.subscribe(v => {
      this.ngOnInit();
    });
  }

  ngOnInit(): void {
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

  onEnterLabel() {
    alert("poop")
  }
}
