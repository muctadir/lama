import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// Tyep for label
type label = {
  labelId: Number,
  labelName: String,
  labelDescription: String,
  labelType: String
}

@Component({
  selector: 'app-merge-label-form',
  templateUrl: './merge-label-form.component.html',
  styleUrls: ['./merge-label-form.component.scss']
})
export class MergeLabelFormComponent {

  // Dummy variables
  labels: Array<label> = [
    {
      labelId: 1,
      labelName: "Type A",
      labelDescription: "Nullam gravida enim et ipsum feugiat, lobortis tempus quam facilisis. Phasellus neque lacus, tincidunt non sollicitudin at, mattis id ante. Nullam efficitur scelerisque sem, sit amet pharetra orci pellentesque a. Donec ullamcorper leo eu sagittis dictum. Mauris ut est nisi. Sed sed felis justo. Quisque at ligula quis arcu pretium malesuada. Sed a rutrum felis. Quisque finibus ipsum libero, id lacinia enim varius ullamcorper. Nullam scelerisque dolor nulla, in laoreet libero commodo at. Nunc non lacus at felis maximus sodales sed eu lorem. Integer non cursus felis. Cras vel ornare arcu. Pellentesque finibus at metus vel suscipit. Ut dignissim dictum semper. Pellentesque nec dignissim ex.",
      labelType: "Lorem"
    },
    {
      labelId: 2,
      labelName: "Type B",
      labelDescription: "Nullam gravida enim et ipsum feugiat, lobortis tempus quam facilisis. Phasellus neque lacus, tincidunt non sollicitudin at, mattis id ante. Nullam efficitur scelerisque sem, sit amet pharetra orci pellentesque a. Donec ullamcorper leo eu sagittis dictum. Mauris ut est nisi. Sed sed felis justo. Quisque at ligula quis arcu pretium malesuada. Sed a rutrum felis. Quisque finibus ipsum libero, id lacinia enim varius ullamcorper. Nullam scelerisque dolor nulla, in laoreet libero commodo at. Nunc non lacus at felis maximus sodales sed eu lorem. Integer non cursus felis. Cras vel ornare arcu. Pellentesque finibus at metus vel suscipit. Ut dignissim dictum semper. Pellentesque nec dignissim ex.",
      labelType: "Ipsum"
    },
    {
      labelId: 3,
      labelName: "Type C",
      labelDescription: "Nullam gravida enim et ipsum feugiat, lobortis tempus quam facilisis. Phasellus neque lacus, tincidunt non sollicitudin at, mattis id ante. Nullam efficitur scelerisque sem, sit amet pharetra orci pellentesque a. Donec ullamcorper leo eu sagittis dictum. Mauris ut est nisi. Sed sed felis justo. Quisque at ligula quis arcu pretium malesuada. Sed a rutrum felis. Quisque finibus ipsum libero, id lacinia enim varius ullamcorper. Nullam scelerisque dolor nulla, in laoreet libero commodo at. Nunc non lacus at felis maximus sodales sed eu lorem. Integer non cursus felis. Cras vel ornare arcu. Pellentesque finibus at metus vel suscipit. Ut dignissim dictum semper. Pellentesque nec dignissim ex.",
      labelType: "Lorem"
    }
  ]

  // Constructor modal
  constructor(public activeModal: NgbActiveModal) {}

  // Not implemented function
  notImplemented() {
    alert("Not implemented");
  }

}
