import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/services/rerouting.service';

@Component({
  selector: 'app-create-theme',
  templateUrl: './create-theme.component.html',
  styleUrls: ['./create-theme.component.scss']
})
export class CreateThemeComponent {

  //highlight label variable
  highlightedLabel: String = '';

  //highlight subtheme variable
  highlightedSubtheme: String = '';

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

  //Subthemes Added
  addedSubthemes: String[] = []

  //Hard coded sub-themes
  allSubthemes = ['Happiness','Angriness', 'SupremeSubtheme'];
 
  constructor(private router: Router) { }

  //Adds labels to added labels array.
  addLabel(label:any){
    for (var addedLabel of this.addedLabels){
      if (addedLabel == label.labelName){
        return;
      }
    }
    this.addedLabels.push(label.labelName);
  }

  //Function for adding subtheme to added subthemes array
  addSubtheme(subtheme:any){
    for (var addedSubtheme of this.addedSubthemes){
      if (addedSubtheme == subtheme){
        return;
      }
    }
    this.addedSubthemes.push(subtheme);
  }

  // Function for highlighting selected label
  highlightLabel(label:any){
    this.highlightedLabel = label.labelName;
  }

  //Function for highlighting selected sub-theme
  highlightSubtheme(subtheme:any){
    this.highlightedSubtheme = subtheme;
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
  // Function for removing subtheme
  removeSubtheme(subtheme:any){
  // Go through all labels
  this.addedSubthemes.forEach((addedSubthemes, index)=>{
    // If clicked cross matches the label, splice them from the labels
    if(addedSubthemes==subtheme){
      this.addedSubthemes.splice(index,1);
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

  /**
   * Gets the project id from the URL and reroutes to the theme page
   * of the same project
   * 
   * @trigger back button is pressed
   */
   reRouter() : void {
    // Gets the url from the router
    let url: string = this.router.url
    
    // Initialize the ReroutingService
    let routeService: ReroutingService = new ReroutingService();
    // Use reroutingService to obtain the project ID
    let p_id = routeService.getProjectID(url);
    
    // Changes the route accordingly
    this.router.navigate(['/project', p_id, 'thememanagement']);
  }

}

