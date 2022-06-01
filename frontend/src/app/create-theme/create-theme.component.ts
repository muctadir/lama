import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-create-theme',
  templateUrl: './create-theme.component.html',
  styleUrls: ['./create-theme.component.scss']
})
export class CreateThemeComponent implements OnInit {

  //Hard Coded Labels
  allLabels: String[] = ['Happy', 'Laughter', 'Angry', 'Depressed'];
  
  // Labels Added
  addedLabels: String[] = [];

  //Hard coded sub-themes
  allSubthemes = ['Happiness','Angriness'];
 
  constructor() { }

  ngOnInit(): void {
  }

  addLabel(label:any){
    this.addedLabels.push(label)
  }

  notImplemented(): void {
    alert("Button has not been implemented yet.");
  }

}

