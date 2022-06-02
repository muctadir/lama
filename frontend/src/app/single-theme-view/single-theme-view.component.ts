import { Component, OnInit } from '@angular/core';

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
  labelDescription:'This label is used for any text that give off a general positive feeling of happiness or anything similar.'},
  {labelName:'Laughter',
  labelDescription:'This is laughter'},
  {labelName:'Angry',
  labelDescription:'This is anger'},
  {labelName:'Depressing',
  labelDescription:'This is depression'}];



  constructor() { }

  ngOnInit(): void {
  }

}
