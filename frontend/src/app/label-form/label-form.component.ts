/**
 * @author B. Henkemans
 */
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LabelingDataService } from 'app/labeling-data.service';
import { LabelType } from 'app/classes/label-type';
import { FormControl } from '@angular/forms';
import { Label } from 'app/classes/label';
import { ReroutingService } from 'app/rerouting.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-label-form',
  templateUrl: './label-form.component.html',
  styleUrls: ['./label-form.component.scss']
})
export class LabelFormComponent implements OnInit {
  routeService: ReroutingService;
  url: string;
  labelTypes: Array<LabelType>;

  inputLabelType?: LabelType;
  inputName?: string;
  inputDescription?: string;

  constructor(public activeModal: NgbActiveModal,
    private labelingDataService: LabelingDataService,
    private router: Router) {
      this.labelTypes = new Array<LabelType>();
      this.routeService = new ReroutingService();
      this.url = this.router.url;
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
        // this.labelingDataService.pushLabels(this.labelTypes);
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
