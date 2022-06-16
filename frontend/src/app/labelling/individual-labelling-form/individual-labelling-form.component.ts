import { Component, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Label } from 'app/classes/label';
import { LabelType } from 'app/classes/label-type';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-individual-labelling-form',
  templateUrl: './individual-labelling-form.component.html',
  styleUrls: ['./individual-labelling-form.component.scss'],
})
export class IndividualLabellingForm implements OnInit {
  @Input() labelType?: LabelType;
  @Input() parentForm?: FormArray;
  @Input() reload?: EventEmitter<any>;
  selectedDesc: string | undefined;
  labelForm: FormGroup;
  constructor(private formBuilder: FormBuilder) {
    this.labelForm = this.formBuilder.group({
      labelType: [undefined, [Validators.required]],
      label: [undefined, [Validators.required]],
      remark: [undefined, [Validators.required, Validators.minLength(1)]],
    });
  }

  ngOnInit(): void {
    this.reload?.subscribe(v => {
      this.ngOnInit();
    });
    this.labelForm.reset()
    this.selectedDesc = undefined;
    if (typeof this.labelType === 'undefined') {
      this.selectedDesc = 'Something went wrong while getting the labels.';
    }

    if (typeof this.parentForm === 'undefined') {
      this.selectedDesc = 'Something went wrong while preparing the form.';
    }
    this.labelForm.get('label')?.valueChanges.subscribe((val) => {
      this.labelType?.getLabels().forEach((l: Label) => {
        if (l.getId() == val) {
          this.selectedDesc = l.getDesc();
        }
      });
    });

    this.labelForm.controls['labelType'].patchValue(this.labelType?.getId());

    this.parentForm?.push(this.labelForm);
  }
}
