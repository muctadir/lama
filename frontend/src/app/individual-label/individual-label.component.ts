// <!-- Author: Victoria Bogachenkova -->
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { LabelingDataService } from '../labeling-data.service';
import { EditLabelFormComponent } from '../edit-label-form/edit-label-form.component';
import { Label } from '../label';

// Type for artifact
type artifact = {
  artifactId: number,
  artifactLabeler: string,
  artifactRemarks: string
}

@Component({
  selector: 'app-individual-label',
  templateUrl: './individual-label.component.html',
  styleUrls: ['./individual-label.component.scss']
})
export class IndividualLabelComponent implements OnInit {
  
  // Dummy data
  labelName: String = 'Label 1';
  labelType: Array<String> = ["Emotion", " Positive"];
  labelDescription: String = 'This is a label description.';
  labelThemes: Array<String> = ['Funny',' Positivity',' Casual']

  // Dummy data
  artifacts: Array<artifact> = [
    {
      artifactId: 33,
      artifactLabeler: "Veerle",
      artifactRemarks: "I thought that this was appropriate because"
    },
    {
      artifactId: 35,
      artifactLabeler: "Chinno",
      artifactRemarks: "I thought that this was appropriate because it is cool"
    }
  ]
  
  label: Label = new Label(-1,"","","");
  label_id: number = -1;
  p_id: number = 1;

  constructor(private modalService: NgbModal,
    private route: ActivatedRoute,
    private labelingDataService: LabelingDataService) {}

    
    ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        this.label_id = params['label_id'];
        this.getLabel();
      });
    }
    
    // 
    async getLabel(): Promise<void> {
      const label = await this.labelingDataService.getLabel(this.p_id, this.label_id);
      this.label = label;
    } 

    // Open the modal and populate it with users
    openEdit() {
    const modalRef = this.modalService.open(EditLabelFormComponent,  { size: 'xl'});
    }
}