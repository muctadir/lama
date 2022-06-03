import { Component, OnInit } from '@angular/core';
import { LoremIpsum } from "lorem-ipsum";
import {StringArtifact} from "../stringartifact"

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
// TODO: Replace these with classes once those are overhauled 
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

  // TODO: Pass artifact object here
  // For now hardcoded data
  artifactId: Number = 3;
  artifactIdentifier: String = 'File4';
  labelers: Array<String> = []
  artifact: String = lorem.generateParagraphs(10);
  allLabels: Array<String> = []
  
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

  // What?
  constructor() { }

  ngOnInit(): void {
    let token: string | null  = sessionStorage.getItem('ses_token');
    if (typeof token === "string"){

      // Get the information needed from the back end
      axios.get('http://127.0.0.1:5000/artifact/artifactmanagement', {
        headers: {
          'u_id_token': token
        },
        params: {
          'p_id' : this.p_id
        }
      })
  }

}
