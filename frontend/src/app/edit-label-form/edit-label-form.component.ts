import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// Interface for label
interface label {
  labelName: string,
  labelDescription: string,
  labelTypes: Array<string>
}

@Component({
  selector: 'app-edit-label-form',
  templateUrl: './edit-label-form.component.html',
  styleUrls: ['./edit-label-form.component.scss']
})
export class EditLabelFormComponent {

  // Dummy variables
  labels: Array<label> = [
    {
      labelName: "Type A",
      labelDescription: "Nullam gravida enim et ipsum feugiat, lobortis tempus quam facilisis. Phasellus neque lacus, tincidunt non sollicitudin at, mattis id ante. Nullam efficitur scelerisque sem, sit amet pharetra orci pellentesque a. Donec ullamcorper leo eu sagittis dictum. Mauris ut est nisi. Sed sed felis justo. Quisque at ligula quis arcu pretium malesuada. Sed a rutrum felis. Quisque finibus ipsum libero, id lacinia enim varius ullamcorper. Nullam scelerisque dolor nulla, in laoreet libero commodo at. Nunc non lacus at felis maximus sodales sed eu lorem. Integer non cursus felis. Cras vel ornare arcu. Pellentesque finibus at metus vel suscipit. Ut dignissim dictum semper. Pellentesque nec dignissim ex.",
      labelTypes: ["Lorem"]
    }
  ]

// Contrustor with modal
  constructor(public activeModal: NgbActiveModal) {}

  
  // Not implemented function
  notImplemented() {
    alert("Not implemented");
  }

}
