import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ToastCommService {
  // Observable string sources
  private emitChangeToast = new Subject<any>();
  // Observable string streams
  changeEmitted$ = this.emitChangeToast.asObservable();
  // Service message commands
  emitChange(change: any) {
    this.emitChangeToast.next(change);
  }
}