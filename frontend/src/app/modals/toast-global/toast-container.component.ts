// Imports
import { Component, TemplateRef } from '@angular/core';
import { AppToastService } from 'app/services/app-toast.service';

@Component({
  selector: 'toasts-app',
  // HTML template for the toast
  template: `
    <ngb-toast
      *ngFor="let toast of toastService.toasts"
      [class]="toast.classname"
      [autohide]="true"
      [delay]="toast.delay || 5000"
      (hidden)="toastService.remove(toast)"
    >
      <ng-template [ngIf]="isTemplate(toast)" [ngIfElse]="text">
        <ng-template [ngTemplateOutlet]="toast.textOrTpl"></ng-template>
      </ng-template>

      <ng-template #text>{{ toast.textOrTpl }}</ng-template>
    </ngb-toast>
  `,
  // Where the toast will show up
  host: { 'class': 'toast-container position-fixed top-0 end-0 p-3', 'style': 'z-index: 1200' }
})

export class ToastsContainer {
  constructor(public toastService: AppToastService) { }

  // Template of the toast
  isTemplate(toast: any): any {
    return toast.textOrTpl instanceof TemplateRef;
  }
}
