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
  labelForm: FormGroup;
  routeService: ReroutingService;
  url: string;
  labelTypes: Array<LabelType>;

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

  ngOnInit(): void {
    const p_id = parseInt(this.routeService.getProjectID(this.url));
    this.getLabelTypes(p_id);
  }

  async getLabelTypes(p_id: number) : Promise<void> {
    const labelTypes = await this.labelingDataService.getLabelTypes(p_id);
    this.labelTypes = labelTypes;
  }

  submit (): void {
    // This is a funky Label object. Why?
    // - labelId = 0 - Since I have no clue what the ID is going to be.
    // - labelType = "" - Since this is not relevant.
    let label = new Label(0,
      this.labelForm.controls['labelName'].value,
      this.labelForm.controls['labelDescription'].value,
      "");
    this.submitNew(label);
    this.activeModal.close();
  }

  async submitNew(label: Label) : Promise<void> {
    const p_id = parseInt(this.routeService.getProjectID(this.url));
    this.labelingDataService.submitLabel(p_id, label, this.labelForm.controls['labelTypeId'].value)
  }

  async submitEdit() : Promise<void> {

  }
}
