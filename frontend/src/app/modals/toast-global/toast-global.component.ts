import { Component, OnDestroy } from '@angular/core';

import { AppToastService } from 'app/services/app-toast.service';

@Component({ 
  selector: 'ngbd-toast-global', 
  styleUrls: ['./toast-global.component.scss'],
  templateUrl: './toast-global.component.html'
})
export class ToastGlobalComponent implements OnDestroy {
  constructor(public toastService: AppToastService) {}

  showSuccess(message: string) {
    this.toastService.show(message, { classname: 'bg-success text-light', delay: 10000 });
  }

  showDanger(message: string) {
    console.log('here')
    this.toastService.show(message, { classname: 'bg-danger text-light', delay: 5000 });
    console.log(this.toastService)
  }

  ngOnDestroy(): void {
    this.toastService.clear();
  }
}
