// <!-- Author: Victoria Bogachenkova -->
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CreateLabelFormComponent } from '../create-label-form/create-label-form.component';
import { MergeLabelFormComponent } from '../merge-label-form/merge-label-form.component';

// Type label
type label = {
  labelName: string,
  labelDescription: string,
  labelType: string,
  labeledArtifacts: number
}

@Component({
  selector: 'app-label-management',
  templateUrl: './label-management.component.html',
  styleUrls: ['./label-management.component.scss']
})
export class LabelManagementComponent implements OnInit {
  //Pagination Settings
  page = 1;
  pageSize = 4;

  // Dummy data
  labels: Array<label> = [
    {
      labelName: "Label 1",
      labelDescription: "Nullam gravida enim et ipsum feugiat, lobortis tempus quam facilisis. Phasellus neque lacus, tincidunt non sollicitudin at, mattis id ante. Nullam efficitur scelerisque sem, sit amet pharetra orci pellentesque a. Donec ullamcorper leo eu sagittis dictum. Mauris ut est nisi. Sed sed felis justo. Quisque at ligula quis arcu pretium malesuada. Sed a rutrum felis. Quisque finibus ipsum libero, id lacinia enim varius ullamcorper. Nullam scelerisque dolor nulla, in laoreet libero commodo at. Nunc non lacus at felis maximus sodales sed eu lorem. Integer non cursus felis. Cras vel ornare arcu. Pellentesque finibus at metus vel suscipit. Ut dignissim dictum semper. Pellentesque nec dignissim ex.",
      labelType: "Lorem",
      labeledArtifacts: 7
    },
    {
      labelName: "Label 2",
      labelDescription: "Ut ac venenatis dolor, ut malesuada elit. Donec dapibus imperdiet nunc, eget consequat justo. Curabitur id neque quis ante rhoncus dictum non vel tortor. Mauris orci erat, ullamcorper in magna accumsan, vulputate consequat nisi. Nam ac velit sed nunc commodo venenatis et a nisi. In egestas sapien purus, et tincidunt arcu ultricies vitae. Mauris vulputate felis mauris, quis vestibulum leo auctor vel. Mauris gravida ipsum ac congue auctor. Aliquam dictum, est vel malesuada mollis, dolor justo tempus risus, id pharetra felis orci at diam. Nulla semper et nunc at pulvinar. Phasellus id semper risus, vitae vestibulum augue. Praesent rhoncus id orci in gravida. Cras ultrices tincidunt elit, sed mattis elit mattis quis. Duis quis sapien odio. Nulla laoreet tristique lectus sed posuere. Aenean sem nibh, hendrerit ut odio in, fringilla porta nulla.",
      labelType: "Pellentesque",
      labeledArtifacts: 2
    },
    {
      labelName: "Label 3",
      labelDescription: "Nullam gravida enim et ipsum feugiat, lobortis tempus quam facilisis. Phasellus neque lacus, tincidunt non sollicitudin at, mattis id ante. Nullam efficitur scelerisque sem, sit amet pharetra orci pellentesque a. Donec ullamcorper leo eu sagittis dictum. Mauris ut est nisi. Sed sed felis justo. Quisque at ligula quis arcu pretium malesuada. Sed a rutrum felis. Quisque finibus ipsum libero, id lacinia enim varius ullamcorper. Nullam scelerisque dolor nulla, in laoreet libero commodo at. Nunc non lacus at felis maximus sodales sed eu lorem. Integer non cursus felis. Cras vel ornare arcu. Pellentesque finibus at metus vel suscipit. Ut dignissim dictum semper. Pellentesque nec dignissim ex.",
      labelType: "Lorem",
      labeledArtifacts: 5
    },
    {
      labelName: "Label 4",
      labelDescription: "Ut ac venenatis dolor, ut malesuada elit. Donec dapibus imperdiet nunc, eget consequat justo. Curabitur id neque quis ante rhoncus dictum non vel tortor. Mauris orci erat, ullamcorper in magna accumsan, vulputate consequat nisi. Nam ac velit sed nunc commodo venenatis et a nisi. In egestas sapien purus, et tincidunt arcu ultricies vitae. Mauris vulputate felis mauris, quis vestibulum leo auctor vel. Mauris gravida ipsum ac congue auctor. Aliquam dictum, est vel malesuada mollis, dolor justo tempus risus, id pharetra felis orci at diam. Nulla semper et nunc at pulvinar. Phasellus id semper risus, vitae vestibulum augue. Praesent rhoncus id orci in gravida. Cras ultrices tincidunt elit, sed mattis elit mattis quis. Duis quis sapien odio. Nulla laoreet tristique lectus sed posuere. Aenean sem nibh, hendrerit ut odio in, fringilla porta nulla.",
      labelType: "Ipsum",
      labeledArtifacts: 3
    },
    {
    labelName: "Label 5",
    labelDescription: "Nullam gravida enim et ipsum feugiat, lobortis tempus quam facilisis. Phasellus neque lacus, tincidunt non sollicitudin at, mattis id ante. Nullam efficitur scelerisque sem, sit amet pharetra orci pellentesque a. Donec ullamcorper leo eu sagittis dictum. Mauris ut est nisi. Sed sed felis justo. Quisque at ligula quis arcu pretium malesuada. Sed a rutrum felis. Quisque finibus ipsum libero, id lacinia enim varius ullamcorper. Nullam scelerisque dolor nulla, in laoreet libero commodo at. Nunc non lacus at felis maximus sodales sed eu lorem. Integer non cursus felis. Cras vel ornare arcu. Pellentesque finibus at metus vel suscipit. Ut dignissim dictum semper. Pellentesque nec dignissim ex.",
    labelType: "Lorem",
    labeledArtifacts: 7
    },
    {
      labelName: "Label 6",
      labelDescription: "Ut ac venenatis dolor, ut malesuada elit. Donec dapibus imperdiet nunc, eget consequat justo. Curabitur id neque quis ante rhoncus dictum non vel tortor. Mauris orci erat, ullamcorper in magna accumsan, vulputate consequat nisi. Nam ac velit sed nunc commodo venenatis et a nisi. In egestas sapien purus, et tincidunt arcu ultricies vitae. Mauris vulputate felis mauris, quis vestibulum leo auctor vel. Mauris gravida ipsum ac congue auctor. Aliquam dictum, est vel malesuada mollis, dolor justo tempus risus, id pharetra felis orci at diam. Nulla semper et nunc at pulvinar. Phasellus id semper risus, vitae vestibulum augue. Praesent rhoncus id orci in gravida. Cras ultrices tincidunt elit, sed mattis elit mattis quis. Duis quis sapien odio. Nulla laoreet tristique lectus sed posuere. Aenean sem nibh, hendrerit ut odio in, fringilla porta nulla.",
      labelType: "Pellentesque",
      labeledArtifacts: 8
    },
    {
      labelName: "Label 7",
      labelDescription: "Nullam gravida enim et ipsum feugiat, lobortis tempus quam facilisis. Phasellus neque lacus, tincidunt non sollicitudin at, mattis id ante. Nullam efficitur scelerisque sem, sit amet pharetra orci pellentesque a. Donec ullamcorper leo eu sagittis dictum. Mauris ut est nisi. Sed sed felis justo. Quisque at ligula quis arcu pretium malesuada. Sed a rutrum felis. Quisque finibus ipsum libero, id lacinia enim varius ullamcorper. Nullam scelerisque dolor nulla, in laoreet libero commodo at. Nunc non lacus at felis maximus sodales sed eu lorem. Integer non cursus felis. Cras vel ornare arcu. Pellentesque finibus at metus vel suscipit. Ut dignissim dictum semper. Pellentesque nec dignissim ex.",
      labelType: "Lorem",
      labeledArtifacts: 1
    },
    {
      labelName: "Label 8",
      labelDescription: "Ut ac venenatis dolor, ut malesuada elit. Donec dapibus imperdiet nunc, eget consequat justo. Curabitur id neque quis ante rhoncus dictum non vel tortor. Mauris orci erat, ullamcorper in magna accumsan, vulputate consequat nisi. Nam ac velit sed nunc commodo venenatis et a nisi. In egestas sapien purus, et tincidunt arcu ultricies vitae. Mauris vulputate felis mauris, quis vestibulum leo auctor vel. Mauris gravida ipsum ac congue auctor. Aliquam dictum, est vel malesuada mollis, dolor justo tempus risus, id pharetra felis orci at diam. Nulla semper et nunc at pulvinar. Phasellus id semper risus, vitae vestibulum augue. Praesent rhoncus id orci in gravida. Cras ultrices tincidunt elit, sed mattis elit mattis quis. Duis quis sapien odio. Nulla laoreet tristique lectus sed posuere. Aenean sem nibh, hendrerit ut odio in, fringilla porta nulla.",
      labelType: "Ipsum",
      labeledArtifacts: 10
    },
    {
      labelName: "Label 9",
      labelDescription: "Ut ac venenatis dolor, ut malesuada elit. Donec dapibus imperdiet nunc, eget consequat justo. Curabitur id neque quis ante rhoncus dictum non vel tortor. Mauris orci erat, ullamcorper in magna accumsan, vulputate consequat nisi. Nam ac velit sed nunc commodo venenatis et a nisi. In egestas sapien purus, et tincidunt arcu ultricies vitae. Mauris vulputate felis mauris, quis vestibulum leo auctor vel. Mauris gravida ipsum ac congue auctor. Aliquam dictum, est vel malesuada mollis, dolor justo tempus risus, id pharetra felis orci at diam. Nulla semper et nunc at pulvinar. Phasellus id semper risus, vitae vestibulum augue. Praesent rhoncus id orci in gravida. Cras ultrices tincidunt elit, sed mattis elit mattis quis. Duis quis sapien odio. Nulla laoreet tristique lectus sed posuere. Aenean sem nibh, hendrerit ut odio in, fringilla porta nulla.",
      labelType: "Lorem",
      labeledArtifacts: 8
    },
    {
      labelName: "This is a long label name!",
      labelDescription: "Ut ac venenatis dolor, ut malesuada elit. Donec dapibus imperdiet nunc, eget consequat justo. Curabitur id neque quis ante rhoncus dictum non vel tortor. Mauris orci erat, ullamcorper in magna accumsan, vulputate consequat nisi. Nam ac velit sed nunc commodo venenatis et a nisi. In egestas sapien purus, et tincidunt arcu ultricies vitae. Mauris vulputate felis mauris, quis vestibulum leo auctor vel. Mauris gravida ipsum ac congue auctor. Aliquam dictum, est vel malesuada mollis, dolor justo tempus risus, id pharetra felis orci at diam. Nulla semper et nunc at pulvinar. Phasellus id semper risus, vitae vestibulum augue. Praesent rhoncus id orci in gravida. Cras ultrices tincidunt elit, sed mattis elit mattis quis. Duis quis sapien odio. Nulla laoreet tristique lectus sed posuere. Aenean sem nibh, hendrerit ut odio in, fringilla porta nulla.",
      labelType: "Ipsum",
      labeledArtifacts: 1
    }
  ]
  
// Contructor with modal
  constructor(private modalService: NgbModal) {}

  // Open the modal and merge lables
  openMerge() {
    const modalRef = this.modalService.open(MergeLabelFormComponent,  { size: 'xl'});
  }

  // Open the modal and create a new label
  openCreate() {
    const modalRef = this.modalService.open(CreateLabelFormComponent, { size: 'xl'});
  }

  ngOnInit(): void {
  }

}
