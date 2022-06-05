import { Component, OnInit } from '@angular/core';
import { LoremIpsum } from "lorem-ipsum";
import { Router } from '@angular/router';
import { ReroutingService } from 'app/rerouting.service';
import axios from 'axios';

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
  labelRemark: String
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

  // Initialize the ReroutingService
  routeService: ReroutingService = new ReroutingService();

  // Hardcoded data
  artifactId: Number = 0;
  artifactIdentifier: String = '';
  // labelers: Array<String> = []
  artifact: String = '';
  allLabels: Array<String> = []
  p_id = 0;
  
  labelTypes: Array<labelType> = [
    {
      labelTypeName: "",
      labelTypeDescription: lorem.generateParagraphs(1),
      labels: [{labelName: lorem.generateWords(1), labelDescription: lorem.generateSentences(5)},
               {labelName: lorem.generateWords(1), labelDescription: lorem.generateSentences(5)},
               {labelName: lorem.generateWords(1), labelDescription: lorem.generateSentences(5)},
               {labelName: lorem.generateWords(1), labelDescription: lorem.generateSentences(5)},]
    },
    {
      labelTypeName: "",
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
      labelsGiven: [{labelTypeName1: "Emotion", labelGiven: "Happy", labelRemark: "I did this because I thought it would fit well."},
                    {labelTypeName1: "Language", labelGiven: "Latin", labelRemark: "I did this because I thought it would fit well."}]
    },
    {
      labellerName: "Veerle",
      labelRemark: "I did this because I thought it would fit well.",
      labelsGiven: [{labelTypeName1: "Emotion", labelGiven: "Ecstatic", labelRemark: "I did this because I thought it would fit well."},
                    {labelTypeName1: "Language", labelGiven: "Latin", labelRemark: "I did this because I thought it would fit well."}]
    },
    {
      labellerName: "Jarl Jarl",
      labelRemark: "I did this because I thought it would fit well.",
      labelsGiven: [{labelTypeName1: "Emotion", labelGiven: "Sunshine and Rainbows", labelRemark: "I did this because I thought it would fit well."},
                    {labelTypeName1: "Language", labelGiven: "Latin", labelRemark: "I did this because I thought it would fit well."}]
    },
    
  ]


  notImplemented(){
    alert("This button is not implemented.");
  }

  /**
  * Constructor passes in the modal service, initializes Router
  * @param router instance of Router
  */
   constructor(private router: Router) { }

  ngOnInit(): void {
    // Get artifact object from the artifact management page

    // this.artifactIdentifier = this.message.identifier;
    // this.labelers = 
    // artifact: String = '';
    // allLabels: Array<String> = []
    
    let token: string | null  = sessionStorage.getItem('ses_token');
    if (typeof token === "string"){
      // Gets the url from the router
      let url: string = this.router.url
      this.artifactId = Number(this.routeService.getArtifactID(url))
      console.log(this.artifactId)

      // Get the artifact information from the back end
      axios.get('http://127.0.0.1:5000/artifact/singleArtifact', {
        headers: {
          'u_id_token': token
        },
        params: {
          'a_id' : this.artifactId
        }
      })

      // When there is a response get artifact information
      .then(response => {

        // Pass the artifact information from the response
        let artifact_info = response.data
        this.artifactIdentifier = artifact_info['artifactIdentifier'];
        this.artifact = artifact_info['artifact'];
      })

      // Get the labellings of this artifact
      axios.get('http://127.0.0.1:5000/artifact/artifactLabellings', {
        headers: {
          'u_id_token': token
        },
        params: {
          'a_id' : this.artifactId
        }
      })

      // When there is a response get artifact information
      .then(response => {
        console.log(response.data)
      })
    }
  }
}