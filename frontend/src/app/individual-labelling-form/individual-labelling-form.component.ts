import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Label } from 'app/classes/label';
import { LabelType } from 'app/classes/label-type';

@Component({
  selector: 'app-individual-labelling-form',
  templateUrl: './individual-labelling-form.component.html',
  styleUrls: ['./individual-labelling-form.component.scss'],
})
export class IndividualLabellingForm implements OnInit {
  @Input() labelType?: LabelType;
  @Input() parentForm?: FormArray;
  selectedDesc: string | undefined;
  labelForm: FormGroup;
  constructor(private formBuilder: FormBuilder) {
    this.labelForm = this.formBuilder.group({
      labelType: [undefined],
      label: [undefined],
      remark: [undefined],
    });
  }

  ngOnInit(): void {
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
