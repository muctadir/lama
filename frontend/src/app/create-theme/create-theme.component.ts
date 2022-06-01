import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-create-theme',
  templateUrl: './create-theme.component.html',
  styleUrls: ['./create-theme.component.scss']
})
export class CreateThemeComponent implements OnInit {

  //Hard Coded Labels
  allLabels = ['Happy', 'Laughter', 'Angry', 'Depressed'];
  
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

  // Function for removing label
  removeLabel(label:any){
    // Go through all labels
    this.addedLabels.forEach((addedLabels, index)=>{
      // If clicked cross matches the label, splice them from the labels
      if(addedLabels==label){
        this.addedLabels.splice(index,1);
      }
    });    
  }
  displayDescription(){
    alert("Button has not been implemented yet.");
  }


  notImplemented(): void {
    alert("Button has not been implemented yet.");
  }

}

