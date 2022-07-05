// Imports
import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppToastService {
  // Array of toasts
  toasts: any[] = [];

  /**
   * Adds a toast to the list of toasts
   * 
   * @param textOrTpl the string of the toast
   * @param options options of the toast
   */
  show(textOrTpl: string | TemplateRef<any>, options: any = {}): void {
    this.toasts.push({ textOrTpl, ...options });
  }

  /**
   * Removes a toast from the list of toasts
   * 
   * @param toast toast to remove from the list
   */
  remove(toast: any): void {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  /**
   * Clears the entire list of toasts
   */
  clear(): void {
    this.toasts.splice(0, this.toasts.length);
  }
}
