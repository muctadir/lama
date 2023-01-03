/**
 * @author Bartjan Henkemans
 * @author Victoria Boganchenkova
 */
import { Component} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MergeLabelFormComponent } from 'app/modals/merge-label-form/merge-label-form.component';
import { LabellingDataService } from 'app/services/labelling-data.service';
import { Label } from 'app/classes/label';
import { Router } from '@angular/router';
import { ReroutingService } from 'app/services/rerouting.service';
import { LabelFormComponent } from 'app/modals/label-form/label-form.component';
import { FormBuilder } from '@angular/forms';
import { ProjectDataService } from 'app/services/project-data.service';

// Enumeration for sorting 
enum sorted {
  Not = 0, // Not sorted
  Asc = 1, // Sorted in ascending order
  Des = 2 // Sorted in descending order
}

@Component({
  selector: 'app-label-management',
  templateUrl: './label-management.component.html',
  styleUrls: ['./label-management.component.scss'],
})
export class LabelManagementComponent {
  routeService: ReroutingService;
  p_id: number;
  url: string;
  labels: Array<Label>;
  labelAmount: { [id: number]: string };
  // Frozen status
  frozen = true;

  // Pagination Settings
  page: number;
  pageSize: number;

  //Variables for sorting - all are not sorted
  sortedLabelById = sorted.Not; // Label id
  sortedLabel = sorted.Not; // Label name
  sortedLabelType = sorted.Not; // Label Type 
  sortedNOA = sorted.Not; // Number of artifacts

  // Text from the search bar
  searchForm = this.formBuilder.group({
    search_term: '',
  });

  /**
   * Constructor which:
   * 1. get routerService
   * 2. get url
   * 3. get project if
   * 4. initialize labels variable
   * 5. initialize label amount variable
   * 6. set page
   * 7. set page size
   */
  constructor(
    private modalService: NgbModal,
    private labellingDataService: LabellingDataService,
    private formBuilder: FormBuilder,
    private router: Router,
    private projectDataService: ProjectDataService
  ) {
    this.routeService = new ReroutingService();
    this.url = this.router.url;
    this.p_id = parseInt(this.routeService.getProjectID(this.url));
    this.labels = new Array<Label>();
    this.labelAmount = {};
    this.page = 1;
    this.pageSize = 10;
  }

  async ngOnInit(): Promise<void> {
    this.getLabels();
    this.frozen = await this.projectDataService.getFrozen();
    // Initialize searching click
    this.searchClick();
  }

  /**
   * Function for searching based on clicking on the maginifying glass
   */
  searchClick(): void {
    // Get the search image
    let searchBar = document.getElementById("searchBar")
    if (searchBar != null){
      // On click event handler
      searchBar.onclick = (e) => {
        if (searchBar != null){
          // Get clicked x coordinates
          var x = e.clientX - searchBar.getBoundingClientRect().left;
          // When clicked in the maginifying glass
          if (x > 330) {
            // Search
            this.onEnter()
          }
        }
      }
    }
  }

  // Open the modal and merge labels
  openMerge(): void {
    const modalRef = this.modalService.open(MergeLabelFormComponent, {
      size: 'xl',
    });
    modalRef.result.then(() => {
      this.ngOnInit();
    });
  }

  // Open the modal and create a new label
  openCreate(): void {
    const modalRef = this.modalService.open(LabelFormComponent, { size: 'xl' });
    modalRef.result.then(() => {
      this.ngOnInit();
    });
  }

  /**
   * Get labels
   */
  async getLabels(): Promise<void> {
    try {
      // Get labels from the labelling data service
      const labels = await this.labellingDataService.getLabels(this.p_id);
      this.labels = labels;
      // Get label count
      this.getLabelledCount();
    } catch (e) {
      // Navigate to project page
      this.router.navigate(['project', this.p_id]);
    }
  }

  /**
   * Gets the project id from the URL and reroutes to the single label page
   * of the same project
   *
   * @trigger click on label
   */
  reRouter(label_id: number): void {
    // Changes the route accordingly
    this.router.navigate(['/project', this.p_id, 'singlelabel', label_id]);
  }

  // Gets the search text
  async onEnter(): Promise<void> {
    // Get p_id
    let p_id = Number(this.routeService.getProjectID(this.url));
    // Search text
    var searchText = this.searchForm.value.search_term;
    // If nothing was searched
    if(searchText.length == 0){
      // Get all labels anew
      this.getLabels();
    // Otherwise search
    } else {
      // Pass the search word to services
      let labelsSearched = await this.labellingDataService.search(searchText, p_id);
      
      // List for the labels resulting from the search
      let labelList: Array<Label> = [];
      // For loop through all searched labels
      for (let label of labelsSearched) {
        // Make it an label object
        let newLabel = new Label(label['id'], label['name'], label['description'], label['type']);
        // Append label to list
        labelList.push(newLabel);
      }

      this.labels = labelList;

    }
  }

  // Get the labelled count
  async getLabelledCount(): Promise<void> {
    // Result dictionary
    let resultDict: { [id: number]: string } = {};

    if(this.labels != undefined){
      this.labels.forEach(async (label: Label) => {
        // Wait for the labelling data service to get the labelling count
        const result = await this.labellingDataService.getLabellingCount({
          p_id: this.p_id,
          l_id: label.getId(),
        });
        // Fill in the result dictionary
        resultDict[label.getId()] = result;
      });
    }
    // Set the result equal to the label amount variable
    this.labelAmount = resultDict;
  }


  /**
   * Function for sorting on id
   * 
   */
   sortLabelById(): void {
    // Check if it was sorted ascending
    if (this.sortedLabelById == sorted.Asc) {
      // Make the sorted enum descending
      this.sortedLabelById = sorted.Des;
      // Sort the array
      this.labels.sort((a, b) => b.getId() - a.getId());
      // Check if it was sorted descending or not yet
    } else if (this.sortedLabelById == sorted.Des || this.sortedLabelById == sorted.Not) {
      // Make the sorted enum ascending
      this.sortedLabelById = sorted.Asc;
      // Sort the array
      this.labels.sort((a, b) => a.getId() - b.getId());
    }
    // Set other sorts to not sorted
    this.sortedLabel = sorted.Not;
    this.sortedLabelType = sorted.Not;
    this.sortedNOA = sorted.Not
  }


  /**
   * Function for sorting on name
   * 
   */
  sortLabel(): void {
    // Check if it was sorted ascending
    if (this.sortedLabel == sorted.Asc) {
      // Make the sorted enum descending
      this.sortedLabel = sorted.Des;
      // Sort the array
      this.labels.sort((a, b) => b.getName().localeCompare(a.getName()));
      // Check if it was sorted descending or not yet
    } else if (this.sortedLabel == sorted.Des || this.sortedLabel == sorted.Not) {
      // Make the sorted enum ascending
      this.sortedLabel = sorted.Asc;
      // Sort the array
      this.labels.sort((a, b) => a.getName().localeCompare(b.getName()));
    }
    // Set other sorts to not sorted
    this.sortedLabelType = sorted.Not;
    this.sortedNOA = sorted.Not
    this.sortedLabelById = sorted.Not;
  }

  /**
   * Function for sorting on label type
   * 
  */
  sortLabelType(): void {
    // Check if it was sorted ascending
    if (this.sortedLabelType == sorted.Asc) {
      // Make the sorted enum descending
      this.sortedLabelType = sorted.Des;
      // Sort the array
      this.labels.sort((a, b) => b.getType().localeCompare(a.getType()));
      // Check if it was sorted descending or not yet
    } else if (this.sortedLabelType == sorted.Des || this.sortedLabelType == sorted.Not) {
      // Make the sorted enum ascending
      this.sortedLabelType = sorted.Asc;
      // Sort the array
      this.labels.sort((a, b) => a.getType().localeCompare(b.getType()));
    }
    // Set other sorts to not sorted
    this.sortedLabel = sorted.Not;
    this.sortedNOA = sorted.Not
    this.sortedLabelById = sorted.Not;
  }

  /**
   * Function for sorting on number of artifacts
   * 
  */
  sortNumberOfArtifacts(): void {
    // Check if it was sorted ascending
    if (this.sortedNOA == sorted.Asc) {
      // Make the sorted enum descending
      this.sortedNOA = sorted.Des;
      // Sort the array
      this.labels.sort((a, b) => {
        // Get the number of artifacts labelled
        const n1 = parseInt(this.labelAmount[a.getId()]);
        const n2 = parseInt(this.labelAmount[b.getId()]);
        return n1 - n2;
      });
      // Check if it was sorted descending or not yet
    } else if (this.sortedNOA == sorted.Des || this.sortedNOA == sorted.Not) {
      // Make the sorted enum ascending
      this.sortedNOA = sorted.Asc;
      // Sort the array
      this.labels.sort((a, b) => {
        // Get the number of artifacts labelled
        const n1 = parseInt(this.labelAmount[a.getId()]);
        const n2 = parseInt(this.labelAmount[b.getId()]);
        return n2 - n1;
      });
    }
    // Set other sorts to not sorted
    this.sortedLabel = sorted.Not;
    this.sortedLabelType = sorted.Not
    this.sortedLabelById = sorted.Not;
  }
}
