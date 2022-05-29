import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LabelingDataService } from 'app/labeling-data.service';
import { LabelType } from 'app/label-type';
@Component({
  selector: 'app-label-form',
  templateUrl: './label-form.component.html',
  styleUrls: ['./label-form.component.scss']
})
export class LabelFormComponent implements OnInit {
  labelTypes?: Array<LabelType>;
  @Input() labelType?: LabelType;

  constructor(public activeModal: NgbActiveModal, 
    private labelingDataService: LabelingDataService) {}

  ngOnInit(): void {
    this.getLabels();
  }

  getLabels (): void {
    this.labelingDataService.getLabels()
      .subscribe(labels => this.labelTypes = labels);
  }

  notImplemented() {
    alert("Not implemented");
  }

}
