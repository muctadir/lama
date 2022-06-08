/**
 * @author B. Henkemans
 */
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LabelingDataService } from 'app/labeling-data.service';
import { LabelType } from 'app/classes/label-type';
import { Label } from 'app/classes/label';
import { ReroutingService } from 'app/rerouting.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-label-form',
  templateUrl: './label-form.component.html',
  styleUrls: ['./label-form.component.scss']
})

export class LabelFormComponent implements OnInit {
  //Optional input in the form of a Label
  @Input() label?: Label;
  // Label form
  labelForm: FormGroup;
  // ROuting and url initialising
  routeService: ReroutingService;
  url: string;
  // Label types initialising
  labelTypes: Array<LabelType>;

  /**
   * Check the input
   * @param activeModal
   * @param labelingDataService
   * @param router
   * @param formBuilder
   */
  constructor(public activeModal: NgbActiveModal,
    private labelingDataService: LabelingDataService,
    private router: Router,
    private formBuilder: FormBuilder) {
      this.labelTypes = new Array<LabelType>();
      this.routeService = new ReroutingService();
      this.url = this.router.url;
      this.labelForm = this.formBuilder.group({
        labelName: [undefined],
        labelDescription: [undefined],
        labelTypeId: [undefined]
      })
    }

  /**
   * On init
   * 1. Get the name 
   * 2. Get the description
   * 3. Get the label Type
   * 4. Disable changing label type
   */
  ngOnInit(): void {
    const p_id = parseInt(this.routeService.getProjectID(this.url));
    this.getLabelTypes(p_id);
    if(this.label !== undefined){
      this.labelForm.controls['labelName'].patchValue(this.label.getName());
      this.labelForm.controls['labelDescription'].patchValue(this.label.getDesc());
      this.labelForm.controls['labelTypeId'].patchValue(this.label.getType());
      this.labelForm.controls['labelTypeId'].disable();
    }
  }

  /**
   * Get the different label types
   * @param p_id
   */
  async getLabelTypes(p_id: number) : Promise<void> {
    const labelTypes = await this.labelingDataService.getLabelTypes(p_id);
    this.labelTypes = labelTypes;
  }

  /**
   * Submit the label form with the changes
   */
  submit (): void {
    // This is a funky Label object. Why?
    // - labelId = 0 - Since I have no clue what the ID is going to be.
    // - labelType = "" - Since this is not relevant.
    if (this.label === undefined) {
      let label = new Label(0,
        this.labelForm.controls['labelName'].value,
        this.labelForm.controls['labelDescription'].value,
        "");
        this.submitToServer(label);
    }
    else {
      this.label.setName(this.labelForm.controls['labelName'].value);
      this.label.setDesc(this.labelForm.controls['labelDescription'].value);
      this.submitToServer(this.label);
    }
  }

  /**
   * Submit the label form with the changes to server
   */
  async submitToServer(label: Label) : Promise<void> {
    const p_id = parseInt(this.routeService.getProjectID(this.url));
    // Label was created or modified
    if (this.label === undefined){
      await this.labelingDataService.submitLabel(p_id, label, this.labelForm.controls['labelTypeId'].value);
      window.location.reload();
    } else {
      await this.labelingDataService.editLabel(p_id, label, this.labelForm.controls['labelTypeId'].value);
      window.location.reload();
    }
  }
}
