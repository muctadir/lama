import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ThemeDataService } from 'app/services/theme-data.service';
import { ToastCommService } from 'app/services/toast-comm.service';

@Component({
  selector: 'app-delete-theme',
  templateUrl: './delete-theme.component.html',
  styleUrls: ['./delete-theme.component.scss']
})
export class DeleteThemeComponent {

  // Variables for project id and theme id
  p_id = 0;
  t_id = 0;

  /**
   * Initializes the NgbActiveModal, router, and the themeDataService
   * 
   * @param activeModal instance of NgbActiveModal
   * @param router instance of Router
   * @param themeDataService instance of ThemeDataService
   */
   constructor(public activeModal: NgbActiveModal, 
    private themeDataService: ThemeDataService, 
    private router: Router,
    private toastCommService: ToastCommService) { }

   /**
    * Call the service to delete the theme
  */
  async deleteTheme(): Promise<void> {
    // Call the service to delete the theme
    await this.themeDataService.delete_theme(this.p_id, this.t_id);
    // Go back to the theme management page
    this.router.navigate(['/project', this.p_id, 'thememanagement']);

    this.toastCommService.emitChange([true, "Deletion successful"]);
    // Closes the modal
    this.activeModal.close();
  }

}
