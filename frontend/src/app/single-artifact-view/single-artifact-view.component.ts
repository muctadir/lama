import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoremIpsum } from "lorem-ipsum";
import { ArtifactDataService } from 'app/artifact-data.service';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/rerouting.service';
import axios from 'axios';
import { StringArtifact } from 'app/classes/stringartifact';

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
// For table data of users + labels given
// TODO: Replace these with classes once those are overhauled 
type userLabel = {
  labellerName: String,
  labelsGiven: Array<labelGroup>
}
//For labels given by 1 user
type labelGroup = {
  labelTypeName: String,
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
  routeService: ReroutingService;

  // Artifact Data
  artifact: StringArtifact;
  allLabels: Array<String> = []
  url: string;

  userLabels: Array<userLabel> = [
    {
      labellerName: "Chinno",
      labelsGiven: [{ labelTypeName: "Emotion", labelGiven: "Happy", labelRemark: "I did this because I thought it would fit well." },
      { labelTypeName: "Language", labelGiven: "Latin", labelRemark: "I did this because I thought it would fit well." }]
    },
    {
      labellerName: "Veerle",
      labelsGiven: [{ labelTypeName: "Emotion", labelGiven: "Ecstatic", labelRemark: "I did this because I thought it would fit well." },
      { labelTypeName: "Language", labelGiven: "Latin", labelRemark: "I did this because I thought it would fit well." }]
    },
    {
      labellerName: "Jarl Jarl",
      labelsGiven: [{ labelTypeName: "Emotion", labelGiven: "Sunshine and Rainbows", labelRemark: "I did this because I thought it would fit well." },
      { labelTypeName: "Language", labelGiven: "Latin", labelRemark: "I did this because I thought it would fit well." }]
    },

  ]


  notImplemented() {
    alert("This button is not implemented.");
  }

  /**
     * Constructor passes in the modal service and the artifact service,
     * initializes Router
     * @param modalService instance of NgbModal
     * @param artifactDataService instance of ArtifactDataService
     * @param router instance of Router
     */
   constructor(private modalService: NgbModal,
    private artifactDataService: ArtifactDataService,
    private router: Router) {
      this.routeService = new ReroutingService();
      this.artifact = new StringArtifact(0, 'null', 'null');
      this.url = this.router.url;
    }

  ngOnInit(): void {
    // Get the ID of the artifact and the project
    let a_id = Number(this.routeService.getArtifactID(this.url));
    let p_id = Number(this.routeService.getProjectID(this.url));
    
    // Get the artifact data from the backend
    this.getArtifact(a_id, p_id)
  }

  async getArtifact(a_id: number, p_id: number): Promise<void>{
    const artifact = await this.artifactDataService.getArtifact(p_id, a_id);
    this.artifact = artifact
  }
}