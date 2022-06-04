/**
 * What the hell is this?
 * Well - This is some really rough code for the theme management page.
 * Q: Why is it such a mess?
 * A: I suck - partially. @Vic came with this briliant suggestion https://ng-bootstrap.github.io/#/components/table/examples#sortable
 *    It is a good idea, but I had already done a lot of other stuff. I tried to morph my code into that but that turned out to be difficult.
 *    I will come back to this!
 */
import { Component, OnInit, Query, QueryList, ViewChildren } from '@angular/core';
import { Theme } from '../theme';
import { LoremIpsum } from "lorem-ipsum";
import { sortEvent, SortableThemeHeader } from '../sortable-theme.directive';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/rerouting.service';

// Type label
type label = {
  labelName: string,
  labelDescription: string,
  labelType: string,
  labeledArtifacts: number
}


const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});


@Component({
  selector: 'app-theme-management',
  templateUrl: './theme-management.component.html',
  styleUrls: ['./theme-management.component.scss']
})
export class ThemeManagementComponent  {

  //Pagination Settings
  page = 1;
  pageSize = 4;



  /**
   * Code to fill page
   */
  randomNumber: number = Math.ceil(Math.random() * 9);

  themes: Array<Theme>;
  constructor(private router: Router) {
    this.themes = new Array<Theme>();
    for (var i: number = 0; i < this.randomNumber; i = i + 1){
      var title:string = lorem.generateWords(1);
      this.themes.push(new Theme((title.charAt(0).toUpperCase() + title.slice(1)), lorem.generateParagraphs(2)));
    }
   }

   notImplemented(): void {
     alert("Button has not been implemented yet.");
   }

  /**
   * Gets the project id from the URL and reroutes to other pages
   * of the same project
   */
   reRouter(new_page : string) : void {
    // Gets the url from the router
    let url: string = this.router.url
    
    // Initialize the ReroutingService
    let routeService: ReroutingService = new ReroutingService();
    // Use reroutingService to obtain the project ID
    let p_id = routeService.getProjectID(url);
    
    // Changes the route accordingly
    this.router.navigate(['/project', p_id, new_page]);
  }
}
