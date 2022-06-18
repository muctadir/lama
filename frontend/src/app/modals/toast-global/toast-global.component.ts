import { Component, OnDestroy } from '@angular/core';
import { AppToastService } from 'app/services/app-toast.service';
import { ToastCommService } from 'app/services/toast-comm.service';

@Component({ 
  selector: 'ngbd-toast-global', 
  styleUrls: ['./toast-global.component.scss'],
  templateUrl: './toast-global.component.html'
})
export class ToastGlobalComponent implements OnDestroy {

  /**
   * Initializes the AppToastService and the toastCommService, 
   * displays a success toast if text[0] = true, and otherwise an error toast 
   * @param toastService instance of the AppToastService
   * @param toastCommService instance of the ToastCommService
   */
  constructor(public toastService: AppToastService, private toastCommService: ToastCommService) {
    toastCommService.changeEmitted$.subscribe(text => {
      // Displays a success toast with as text text[1]
      if (text[0]) {
        this.toastService.show(text[1], { classname: 'bg-success text-light', delay: 5000 });
      } else {
        // Displays an error toast with as text text[1]
        this.toastService.show(text[1], { classname: 'bg-danger text-light', delay: 5000 });
      }
    });
  }

  /**
   * Destroys the toasts (removes them from the DOM)
   */
  ngOnDestroy(): void {
    this.toastService.clear();
  }
}
