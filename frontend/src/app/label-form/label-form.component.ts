/**
 * @author B. Henkemans
 */
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LabelingDataService } from 'app/labeling-data.service';
import { LabelType } from 'app/classes/label-type';
import { Label } from 'app/classes/label';
@Component({
  selector: 'app-label-form',
  templateUrl: './label-form.component.html',
  styleUrls: ['./label-form.component.scss']
})
export class LabelFormComponent implements OnInit {
  labelTypes?: Array<LabelType>;
  inputLabelType?: LabelType;
  inputName?: string;
  inputDescription?: string;

  constructor(public activeModal: NgbActiveModal, 
    private labelingDataService: LabelingDataService) {
    }

  ngOnInit(): void {
    this.getLabels();
  }

  getLabels (): void {
    this.labelingDataService.getLabels()
      .subscribe(labels => this.labelTypes = labels);
  }

  submit (): void {
    if(this.labelTypes === undefined 
      || this.inputLabelType === undefined 
      || this.inputName === undefined
      || this.inputDescription === undefined
      ) {
        throw new Error ("Something went wrong.");
      }
      else {
        for (var i: number = 0; i < this.labelTypes.length; i++) {
          if (this.labelTypes[i].getName() === this.inputLabelType.getName()) {
            this.labelTypes[i].addLabel(new Label(1, this.inputName, this.inputName, 
              this.inputDescription));
              break;
          }
        }
        this.labelingDataService.pushLabels(this.labelTypes);
      }
    
    this.activeModal.close();
  }
  /**
   * Error function for unimplemented features.
   */
  notImplemented(): void{
    throw new Error("This function has not been implemented yet.");
  }

}
