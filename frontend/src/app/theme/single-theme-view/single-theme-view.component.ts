import { Component } from '@angular/core';
import { Theme } from 'app/classes/theme';
import { Label } from 'app/classes/label';
import { Router} from "@angular/router";
import { ReroutingService } from 'app/services/rerouting.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ThemeDataService } from 'app/services/theme-data.service';
import { DeleteThemeComponent } from 'app/modals/delete-theme/delete-theme.component';
import { HistoryComponent } from 'app/modals/history/history.component';
import { ToastCommService } from 'app/services/toast-comm.service';
import { StringArtifact } from 'app/classes/stringartifact';

@Component({
  selector: 'app-single-theme-view',
  templateUrl: './single-theme-view.component.html',
  styleUrls: ['./single-theme-view.component.scss']
})

export class SingleThemeViewComponent {

  // Variable for theme id
  t_id: number;
  // Variable for project id
  p_id: number;

  // Variables for routing
  url: string;
  routeService: ReroutingService;

  // Variable for the theme
  theme: Theme; 

  constructor(private router: Router, 
    private themeDataService: ThemeDataService, 
    private modalService: NgbModal,
    private toastCommService: ToastCommService) { 
    // Gets the url from the router
    this.url = this.router.url
    // Initialize the ReroutingService
    this.routeService = new ReroutingService();
    // Use reroutingService to obtain the project ID
    this.p_id = Number(this.routeService.getProjectID(this.url));
    // Use reroutingService to obtain the project ID
    this.t_id = Number(this.routeService.getThemeID(this.url));
    // Initialize theme
    this.theme = new Theme(0, "", "")
  }
  
  ngOnInit(): void {
    // Get the information for the theme
    this.get_single_theme_info(this.p_id, this.t_id);
  }

  // Async function for getting the single theme info
  async get_single_theme_info(p_id: number, t_id: number){
    // Put the gotten themes into the list of themes
    this.theme = await this.themeDataService.single_theme_info(p_id, t_id);
    // Sort the artifacts
    this.sortArtifacts();
  }

  /**
   * Function to sort the artifacts in a label
   *
   */
  sortArtifacts(): void {
    // Get the labels of the theme
    let labels = this.theme.getLabels();
    if(labels != undefined){
      // For each label, get the artifacts
      for (let label of labels){
        // Get the artifacts
        let artifacts = label.getArtifacts();
        if (artifacts != undefined){
          // Sort the artifacts
          artifacts.sort((a,b) => a.getId() - b.getId());
        }
        // Set the artifacts of the label with the sorted array
        label.setArtifacts(artifacts);
      }
    }
  }

  /**
   * Function to get the artifacts of the label and remove the duplicates
   * 
   * @param label 
   */
  getNonDoubleArtifacts(label: Label): StringArtifact[] {
    // Get the artifacts of the label
    let artifacts = label.getArtifacts();
    if(artifacts != undefined){
      // Remove the duplicates from the list
      return Array.from(artifacts.reduce((m, t) => m.set(t.getId(), t), new Map()).values());
    }
    return [];
  }

  /**
   * Gets the project id from the URL and reroutes to the theme management page
   * of the same project
   * 
   * @trigger back button is pressed
  */
  reRouter() : void { 
    // Changes the route accordingly
    this.router.navigate(['/project', this.p_id, 'thememanagement']);
  }

  /**
   * Reroutes to other pages of the same project
   * Has the theme id
   * @trigger a child or parent theme is clicked
  */
  reRouterTheme(theme_id: number) : void {
    // Changes the route accordingly
    this.router.navigate(['/project', this.p_id, "singleTheme", theme_id])
    // And reload the page
    .then(() => {
      // Get the information for the theme
      this.get_single_theme_info(this.p_id, theme_id);
    });
  }   

  /**
   * Reroutes to other edit page of the theme
   * @trigger the edit button is clicked
  */
  reRouterEdit() : void {
    // Changes the route accordingly
    this.router.navigate(['/project', this.p_id, "editTheme", this.t_id]);
  }  

  // Function for making sure parent name is not undefined
  getParentName(): string {
  // Get the parent
  let parent = this.theme.getParent();
    // Check is parent is undefined
    if(parent != undefined){
      if(parent.getName() != undefined){
        // If not return the name
        return parent.getName();
      } else {
        // Otherwise return ""
        return "";
      }
    }   
    // Otherwise return ""
    return "";
  }

  /**
   * Function to redirect user to theme they clicked on
   * 
   * @trigger a sub or super-theme is pressed
  */
  goToTheme(theme: Theme | undefined){
    // Check if we can get the id of the theme
    if (theme != undefined){
      this.reRouterTheme(theme.getId());
    }
  }

  /**
   * Function for deleting the theme
   * 
   * @Trigger When the delete button is clicked
   */
  deleteTheme(){
    // Get the children and labels
    let children = this.theme.getChildren();
    let labels = this.theme.getLabels();
    // Check if the children and labels are undefined
    if(children != undefined && labels != undefined){
      // Check the length of the arrays
      if(labels.length != 0 || children.length != 0){
        // Alert that the theme cannot be deleted
        this.toastCommService.emitChange([false, "This theme has sub-themes and/or labels, so it cannot be deleted"]);
        return;
      }
    }
    // Open the modal
    const modalRef = this.modalService.open(DeleteThemeComponent, {});
    // Give the modal the project id and theme id
    modalRef.componentInstance.p_id = this.p_id;
    modalRef.componentInstance.t_id = this.t_id; 
  }

  /**
   * Opens the modal displaying the theme history
   * 
   * @trigger on click of history icon
   */
  openThemeHistory(): void {
    // opens theme history modal
    let modalRef = this.modalService.open(HistoryComponent, {size: 'xl'});

    // passes all the users in the application to the modal
    modalRef.componentInstance.history_type = "Theme";
  }
}
