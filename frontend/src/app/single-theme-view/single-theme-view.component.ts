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


  constructor() { }

  ngOnInit(): void {
  }

}
