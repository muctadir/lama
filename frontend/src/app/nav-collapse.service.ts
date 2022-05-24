import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavCollapseService {

  private collapsed = new BehaviorSubject(true);
  currentCollapsed = this.collapsed.asObservable();

  constructor() { }

  modifyCollapsed(message: boolean) {
    this.collapsed.next(!message);
  }
}
