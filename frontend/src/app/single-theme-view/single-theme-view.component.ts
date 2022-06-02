import { Component, OnInit } from '@angular/core';

//Test array for label holding artifacts

@Component({
  selector: 'app-single-theme-view',
  templateUrl: './single-theme-view.component.html',
  styleUrls: ['./single-theme-view.component.scss']
})
export class SingleThemeViewComponent implements OnInit {

  //Theme Name Variable
  themeName: String = '';

  //HardCoded Parent-Themes
  parentThemes = ['Emotional','Analytical'];
  //HardCoded Sub-Themes
  subThemes = ['Happiness','Humor'];


  //Hard Coded Labels
  allLabels = [{labelName:'Happy',
  labelDescription:'This label is used for any text that give off a general positive feeling of happiness or anything similar.',
  labelArtifacts: [{artifactName: 'Artifact 1', artifactText: 'Sunshine and Rainbows', artifactRemark: 'I thought that this is the best thing ever.'},
                {artifactName: "Artifact 2", artifactText: 'The quick brown fox jumps over the lazy sleeping dog', artifactRemark: 'I thought that this is the second best thing ever.'}]}
  ];


  constructor() { }

  ngOnInit(): void {
  }

}
