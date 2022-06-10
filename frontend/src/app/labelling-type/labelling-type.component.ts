import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Label } from 'app/classes/label';
import { LabelType } from 'app/classes/label-type';

@Component({
  selector: 'app-labelling-type',
  templateUrl: './labelling-type.component.html',
  styleUrls: ['./labelling-type.component.scss']
})
export class LabellingTypeComponent implements OnInit {
  @Input() labelType?: LabelType = new LabelType(1, "Emotion", new Array<Label>(new Label(1, "Happy", "This is when someone is happy", "Emotion"),
  new Label(2, "Sad", "This is when someone is sad", "Emotion")));
  selectedDesc: string | undefined;
  labelForm: FormGroup;
  constructor(private formBuilder: FormBuilder) {
    this.labelForm = this.formBuilder.group({
      label: [undefined],
      remark: [undefined]
    });
  }

  ngOnInit(): void {
    this.labelForm.get("label")?.valueChanges.subscribe(val => {
      this.labelType?.getLabels().forEach((l:Label) => {
        if (l.getId() == val) {
          this.selectedDesc = l.getDesc();
        }
      });
    })
  }

}
