import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavCollapseService {

  /* Indicates whether the navigation menu is collapsed or not, initially true => collapsed */
  private collapsed = new BehaviorSubject(true);
  /* Holds the current state of the BehaviourSubject */
  currentCollapsed = this.collapsed.asObservable();


  private page = new BehaviorSubject(0);
  current_page = this.page.asObservable();

  /**
   * Changes the value of collapsed BehaviourSubject to the opposite
   * 
   * @param message the current state
   * @modifies collapsed
   */
  modifyCollapsed(message: boolean) : void {
    this.collapsed.next(!message);
  }


  modifyPage(new_page: number) : void {
    this.page.next(new_page);
  }

  getPage() : number {
    return this.page.getValue();
  }
}
