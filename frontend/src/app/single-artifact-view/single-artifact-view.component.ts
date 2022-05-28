import { Component, OnInit } from '@angular/core';
import { LoremIpsum } from "lorem-ipsum";

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
// For table data of users + labels given 
type userLabel = {
  labellerName: String,
  labelRemark: String,
  labelsGiven: Array<labelGroup>

}
//For labels given by 1 user
type labelGroup = {
  labelTypeName1: String,
  labelGiven: String,

}

type label = {
  labelName: String,
  labelDescription: String,
}


@Component({
  selector: 'app-single-artifact-view',
  templateUrl: './single-artifact-view.component.html',
  styleUrls: ['./single-artifact-view.component.scss']
})
export class SingleArtifactViewComponent implements OnInit {

  artifactId: Number = 1;
  artifactIdentifier: String = 'XJY03';
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
  userLabels: Array<userLabel> = [
    {
      labellerName: "Chinno",
      labelRemark: "I did this because I thought it would fit well.",
      labelsGiven: [{labelTypeName1: "Emotion", labelGiven: "Happy"},
                    {labelTypeName1: "Language", labelGiven: "Latin"}]
    },
    {
      labellerName: "Veerle",
      labelRemark: "Maybe this was suitable because...",
      labelsGiven: [{labelTypeName1: "Emotion", labelGiven: "Ecstatic"},
                    {labelTypeName1: "Language", labelGiven: "Latin"}]
    },
    {
      labellerName: "Jarl Jarl",
      labelRemark: "I thought that perhaps the blah fitted the bloo",
      labelsGiven: [{labelTypeName1: "Emotion", labelGiven: "Sunshine and Rainbows"},
                    {labelTypeName1: "Language", labelGiven: "Latin"}]
    },
  ]


  notImplemented(){
    alert("This button is not implemented.");
  }


  constructor() { }

  ngOnInit(): void {
  }

}
