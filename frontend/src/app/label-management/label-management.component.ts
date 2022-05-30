// <!-- Author: Victoria Bogachenkoca -->
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CreateLabelFormComponent } from '../create-label-form/create-label-form.component';
import { MergeLabelFormComponent } from '../merge-label-form/merge-label-form.component';

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

  labels: Array<label> = [
    {
      labelName: "Type A",
      labelDescription: "Nullam gravida enim et ipsum feugiat, lobortis tempus quam facilisis. Phasellus neque lacus, tincidunt non sollicitudin at, mattis id ante. Nullam efficitur scelerisque sem, sit amet pharetra orci pellentesque a. Donec ullamcorper leo eu sagittis dictum. Mauris ut est nisi. Sed sed felis justo. Quisque at ligula quis arcu pretium malesuada. Sed a rutrum felis. Quisque finibus ipsum libero, id lacinia enim varius ullamcorper. Nullam scelerisque dolor nulla, in laoreet libero commodo at. Nunc non lacus at felis maximus sodales sed eu lorem. Integer non cursus felis. Cras vel ornare arcu. Pellentesque finibus at metus vel suscipit. Ut dignissim dictum semper. Pellentesque nec dignissim ex.",
      labelType: "Lorem",
      labeledArtifacts: 7
    },
    {
      labelName: "Type B",
      labelDescription: "Ut ac venenatis dolor, ut malesuada elit. Donec dapibus imperdiet nunc, eget consequat justo. Curabitur id neque quis ante rhoncus dictum non vel tortor. Mauris orci erat, ullamcorper in magna accumsan, vulputate consequat nisi. Nam ac velit sed nunc commodo venenatis et a nisi. In egestas sapien purus, et tincidunt arcu ultricies vitae. Mauris vulputate felis mauris, quis vestibulum leo auctor vel. Mauris gravida ipsum ac congue auctor. Aliquam dictum, est vel malesuada mollis, dolor justo tempus risus, id pharetra felis orci at diam. Nulla semper et nunc at pulvinar. Phasellus id semper risus, vitae vestibulum augue. Praesent rhoncus id orci in gravida. Cras ultrices tincidunt elit, sed mattis elit mattis quis. Duis quis sapien odio. Nulla laoreet tristique lectus sed posuere. Aenean sem nibh, hendrerit ut odio in, fringilla porta nulla.",
      labelType: "Pellentesque",
      labeledArtifacts: 2
    },
  ]
  

  constructor(private modalService: NgbModal) {}

  // Open the modal and populate it with users
  openMerge() {
    const modalRef = this.modalService.open(MergeLabelFormComponent,  { size: 'xl'});
    // modalRef.componentInstance.users = this.all_members;
    // // Push the username into the members list 
    // modalRef.componentInstance.newItemEvent.subscribe(($e: any) => {
    //   var username = {userName: $e};
    //   this.project_members.push(username);
    // })
  }

  // Open the modal and populate it with users
  openCreate() {
    const modalRef = this.modalService.open(CreateLabelFormComponent, { size: 'xl'});
    // modalRef.componentInstance.users = this.all_members;
    // // Push the username into the members list 
    // modalRef.componentInstance.newItemEvent.subscribe(($e: any) => {
    //   var username = {userName: $e};
    //   this.project_members.push(username);
    // })
  }

  ngOnInit(): void {
  }

}
