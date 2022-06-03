import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-create-theme',
  templateUrl: './create-theme.component.html',
  styleUrls: ['./create-theme.component.scss']
})
export class CreateThemeComponent implements OnInit {

  //highlight label variable
  highlightedLabel: String = '';

  //Hard Coded Labels
  allLabels = [{labelName:'Happy',
                labelDescription:'This label is used for any text that give off a general positive feeling of happiness or anything similar.'},
                {labelName:'Laughter',
                labelDescription:'This is laughter'},
                {labelName:'Angry',
                labelDescription:'This is anger'},
                {labelName:'Depressing',
                labelDescription:'This is depression'}];

  //Selected Labels description
  selectedDescription: String = '';

  // Labels Added
  addedLabels: String[] = [];

  //Hard coded sub-themes
  allSubthemes = ['Happiness','Angriness', 'SupremeSubtheme'];
 
  constructor() { }

  ngOnInit(): void {
  }
  //Adds labels to added labels array.
  addLabel(label:any){
    for (var addedLabel of this.addedLabels){
      if (addedLabel == label.labelName){
        return;
      }
    }
    this.addedLabels.push(label.labelName);
  }
  // Function for highlighting selected label
  highlightLabel(label:any){
    this.highlightedLabel = label.labelName;
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
  //Displays the description for selected label
  displayDescription(label:any){
    this.selectedDescription = label.labelDescription;
  }

  // Filler for TODO functions
  notImplemented(): void {
    alert("Button has not been implemented yet.");
  }

}

