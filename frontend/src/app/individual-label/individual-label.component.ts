import { Component, OnInit } from '@angular/core';

type artifact = {
  artifactId: number,
  artifactLabeler: string,
  artifactRemarks: string
}

@Component({
  selector: 'app-individual-label',
  templateUrl: './individual-label.component.html',
  styleUrls: ['./individual-label.component.scss']
})
export class IndividualLabelComponent implements OnInit {

  labelName: String = 'Label 1';
  labelType: Array<String> = ["Emotion", "Positive"];
  labelDescription: String = 'This is a label description.';
  labelThemes: Array<String> = ['Funny',' Positivity',' Casual']

  artifacts: Array<artifact> = [
    {
      artifactId: 33,
      artifactLabeler: "Veerle",
      artifactRemarks: "I thought that this was appropriate because"
    },
    {
      artifactId: 35,
      artifactLabeler: "Chinno",
      artifactRemarks: "I thought that this was appropriate because it is cool"
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}