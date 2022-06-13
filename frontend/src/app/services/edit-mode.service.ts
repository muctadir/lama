import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EditModeService {
  public isInEditMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
}
