import { LoremIpsum } from "lorem-ipsum";
import { Component, OnInit } from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { LabelFormComponent } from 'app/label-form/label-form.component';

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

type labelType = {
  labelTypeName: String,
  labelTypeDescription: String,
  labels: Array<label>
}

type label = {
  labelName: String,
  labelDescription: String,
}

@Component({
  selector: 'app-labelling-page',
  templateUrl: './labelling-page.component.html',
  styleUrls: ['./labelling-page.component.scss']
})
export class LabellingPageComponent implements OnInit {
  artifactId: Number = 1;
  labelers: Array<String> = ["Bartjan", "Veerle"]
  artifact: String = lorem.generateParagraphs(10);
  labelTypes: Array<labelType> = [
    {
      labelTypeName: "Type A",
      labelTypeDescription: lorem.generateParagraphs(1),
      labels: [{labelName: lorem.generateWords(1), labelDescription: lorem.generateSentences(5)},
               {labelName: lorem.generateWords(1), labelDescription: lorem.generateSentences(5)},
               {labelName: lorem.generateWords(1), labelDescription: lorem.generateSentences(5)},
               {labelName: lorem.generateWords(1), labelDescription: lorem.generateSentences(5)},]
    },
    {
      labelTypeName: "Type B",
      labelTypeDescription: lorem.generateParagraphs(1),
      labels: [{labelName: lorem.generateWords(1), labelDescription: lorem.generateSentences(5)},
               {labelName: lorem.generateWords(1), labelDescription: lorem.generateSentences(5)},
               {labelName: lorem.generateWords(1), labelDescription: lorem.generateSentences(5)},
               {labelName: lorem.generateWords(1), labelDescription: lorem.generateSentences(5)},]
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

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  open() {
    const modalRef = this.modalService.open(LabelFormComponent, { size: 'xl'});
  }

}
