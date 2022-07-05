// Imports
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class EditModeService {
  // Boolean for the edit mode
  public isInEditMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
}
