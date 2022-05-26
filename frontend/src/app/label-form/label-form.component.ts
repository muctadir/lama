import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
type labelType = {
  labelTypeName: String,
  labelTypeDescription: String,
  labels: Array<String>
}

@Component({
  selector: 'app-label-form',
  templateUrl: './label-form.component.html',
  styleUrls: ['./label-form.component.scss']
})
export class LabelFormComponent implements OnInit {
  labelTypes: Array<labelType> = [
    {
      labelTypeName: "Type A",
      labelTypeDescription: "Nullam gravida enim et ipsum feugiat, lobortis tempus quam facilisis. Phasellus neque lacus, tincidunt non sollicitudin at, mattis id ante. Nullam efficitur scelerisque sem, sit amet pharetra orci pellentesque a. Donec ullamcorper leo eu sagittis dictum. Mauris ut est nisi. Sed sed felis justo. Quisque at ligula quis arcu pretium malesuada. Sed a rutrum felis. Quisque finibus ipsum libero, id lacinia enim varius ullamcorper. Nullam scelerisque dolor nulla, in laoreet libero commodo at. Nunc non lacus at felis maximus sodales sed eu lorem. Integer non cursus felis. Cras vel ornare arcu. Pellentesque finibus at metus vel suscipit. Ut dignissim dictum semper. Pellentesque nec dignissim ex.",
      labels: ["Lorem", "ipsum", "dolor", "sit", "amet"]
    },
    {
      labelTypeName: "Type B",
      labelTypeDescription: "Ut ac venenatis dolor, ut malesuada elit. Donec dapibus imperdiet nunc, eget consequat justo. Curabitur id neque quis ante rhoncus dictum non vel tortor. Mauris orci erat, ullamcorper in magna accumsan, vulputate consequat nisi. Nam ac velit sed nunc commodo venenatis et a nisi. In egestas sapien purus, et tincidunt arcu ultricies vitae. Mauris vulputate felis mauris, quis vestibulum leo auctor vel. Mauris gravida ipsum ac congue auctor. Aliquam dictum, est vel malesuada mollis, dolor justo tempus risus, id pharetra felis orci at diam. Nulla semper et nunc at pulvinar. Phasellus id semper risus, vitae vestibulum augue. Praesent rhoncus id orci in gravida. Cras ultrices tincidunt elit, sed mattis elit mattis quis. Duis quis sapien odio. Nulla laoreet tristique lectus sed posuere. Aenean sem nibh, hendrerit ut odio in, fringilla porta nulla.",
      labels: ["Pellentesque", "sit ", "ligula", "vitae"]
    },
  ]

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
  }

  notImplemented() {
    alert("Not implemented");
  }

}
