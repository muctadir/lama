// Imports
import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppToastService {
  // Array of toasts
  toasts: any[] = [];

  // Show the toast
  show(textOrTpl: string | TemplateRef<any>, options: any = {}): void {
    this.toasts.push({ textOrTpl, ...options });
  }

  // Remove the toast from the array
  remove(toast: any): void {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  // Clear the toast from the array
  clear(): void {
    this.toasts.splice(0, this.toasts.length);
  }
}
