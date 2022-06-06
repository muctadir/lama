import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/rerouting.service';

//Test array for label holding artifacts

@Component({
  selector: 'app-single-theme-view',
  templateUrl: './single-theme-view.component.html',
  styleUrls: ['./single-theme-view.component.scss']
})
export class SingleThemeViewComponent {

  //Theme Name Variable
  themeName: String = 'Theme 1';

  themeDescription: String = 'Lorem ipsum dolor sit amet. Et beatae sint ut unde architecto cum esse sequi in sapiente temporibus vel cupiditate amet ut omnis ipsum. 33 eius consequatur aut nemo asperiores et recusandae dolore. Qui voluptatem amet non voluptate error id facilis voluptas ad quod commodi ut rerum officiis eum minus dolores. Et quisquam earum sed quas saepe est nesciunt corporis aut aliquid galisum.';

  //HardCoded Parent-Themes
  parentTheme = ['Emotional'];

  //HardCoded Sub-Themes
  subThemes = ['Happiness','Humor'];

  //Hard Coded Labels
  allLabels = [{labelName:'Happy',
  labelDescription:'This label is used for any text that give off a general positive feeling of happiness or anything similar.',
  labelArtifacts: [{artifactName: 'Artifact 1', artifactText: 'Lorem ipsum dolor sit amet. Et beatae sint ut unde architecto cum esse sequi in sapiente temporibus vel cupiditate amet ut omnis ipsum. 33 eius consequatur aut nemo asperiores et recusandae dolore. Qui voluptatem amet non voluptate error id facilis voluptas ad quod commodi ut rerum officiis eum minus dolores. Et quisquam earum sed quas saepe est nesciunt corporis aut aliquid galisum.', artifactRemark: 'I thought that this is the best thing ever.'},
                   {artifactName: "Artifact 2", artifactText: 'The quick brown fox jumps over the lazy sleeping dog', artifactRemark: 'I thought that this is the second best thing ever.'}]},
                   {labelName:'Humor',
  labelDescription:'This label is used for any text that give off a funny feeling or anything similar.',
  labelArtifacts: [{artifactName: 'Artifact 1', artifactText: 'Lorem ipsum dolor sit amet. Et beatae sint ut unde architecto cum esse sequi in sapiente temporibus vel cupiditate amet ut omnis ipsum. 33 eius consequatur aut nemo asperiores et recusandae dolore. Qui voluptatem amet non voluptate error id facilis voluptas ad quod commodi ut rerum officiis eum minus dolores. Et quisquam earum sed quas saepe est nesciunt corporis aut aliquid galisum.', artifactRemark: 'I thought that this was suitable because...'},
                   {artifactName: "Artifact 3", artifactText: 'The man made a funny joke about a cat', artifactRemark: 'I thought that this made sense.'}]}
  ];

  constructor(private router: Router) { }


  notImplemented(): void {
    alert("Button has not been implemented yet.");
  }

  /**
   * Gets the project id from the URL and reroutes to the theme management page
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
