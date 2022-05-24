import { Component, OnInit } from '@angular/core';

type labelType = {
  labelTypeName: String,
  labelTypeDescription: String,
  labels: Array<String>
}


@Component({
  selector: 'app-labelling-page',
  templateUrl: './labelling-page.component.html',
  styleUrls: ['./labelling-page.component.scss']
})
export class LabellingPageComponent implements OnInit {
  artifactId: Number = 1;
  labelers: Array<String> = ["Bartjan", "Veerle"]
  artifact: String = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sed nibh lectus. Mauris ultricies massa nec erat venenatis efficitur. Curabitur sed mattis lorem, eu tempus ante. Maecenas mollis tortor nec dolor viverra consectetur. Nulla pulvinar mauris a ex molestie gravida. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque in pretium risus. Pellentesque eget justo et nisi varius finibus eget sed elit. Morbi porttitor tempor sem, vel mollis augue congue sodales. Cras id eros et nibh venenatis dapibus. Suspendisse potenti. Nam ut metus eget ipsum consequat condimentum vitae ut urna. Phasellus vel eros ac diam posuere consequat non ut erat. Aliquam cursus, turpis a laoreet tempor, lacus metus elementum eros, at eleifend tortor enim et magna. Quisque condimentum orci at fringilla aliquam. Sed vehicula ut risus eget pretium. Suspendisse eleifend lacus in eleifend porttitor. Aliquam sed lorem lectus. Duis porta massa id sodales mattis. Praesent iaculis enim id commodo dictum. Etiam ut fermentum velit. Duis nisi ligula, pretium ut diam eu, aliquam pretium orci. Sed purus nibh, malesuada sit amet quam vitae, scelerisque consequat enim. Curabitur quis nisi tincidunt, volutpat orci sit amet, porttitor arcu. Nam pretium fringilla ex, non sagittis turpis auctor eu. Cras lacinia interdum felis at aliquet. Integer laoreet massa ac purus eleifend molestie. Donec vitae velit sapien. Cras viverra egestas ante vitae dapibus. In blandit pellentesque ligula id dapibus. Fusce placerat, dolor sed viverra sagittis, est orci iaculis lorem, nec cursus risus ipsum nec tellus. Vestibulum lacinia ante viverra suscipit interdum. Nunc ipsum lacus, faucibus ut auctor vel, malesuada id arcu. Curabitur tempus quam viverra, tempor dui in, varius lorem. Fusce ultricies tellus nec nibh porta pretium. Aliquam vitae dolor commodo, tristique massa a, elementum arcu. Nam vel diam at odio vehicula facilisis. Proin at nibh molestie, porttitor lorem id, maximus enim. Donec rhoncus quis libero in lobortis. Etiam et placerat risus. Nulla dignissim eros id dui posuere ultrices. Ut vitae imperdiet nisl, et facilisis sem. Sed auctor enim tincidunt erat rhoncus, sit amet sollicitudin est molestie. Quisque ut placerat elit. Duis aliquet iaculis convallis. Pellentesque vulputate nibh et lorem commodo ullamcorper. Phasellus tempor sapien gravida malesuada ultricies. Vestibulum ac sapien a felis vestibulum iaculis malesuada quis quam. Duis ipsum urna, bibendum at laoreet vel, pharetra et justo. Curabitur blandit nunc eget nunc feugiat placerat."
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

  hightlightedText: Selection | null = null;

  notImplemented(){
    alert("This button is not implemented.");
  }

  selectedText() {
    this.hightlightedText = document.getSelection()
  }

  splitArtifact(){
    alert("Wowee, its a split");
  }
   
  highlightArtifact(){
    alert("Gee wizz, you did a highlight");
  }

  constructor() { }

  ngOnInit(): void {
  }

}
