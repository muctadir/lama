import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-theme',
  templateUrl: './create-theme.component.html',
  styleUrls: ['./create-theme.component.scss']
})
export class CreateThemeComponent implements OnInit {

  //Hard coded labels
  allLabels = ['Happy','Laughter','Angry','Depressed']
  //Hard coded sub-themes
  allSubthemes = ['Happiness','Angriness']
 
  constructor() { }

  ngOnInit(): void {
  }

  notImplemented(): void {
    alert("Button has not been implemented yet.");
  }

}
