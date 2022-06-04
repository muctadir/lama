import { Injectable } from '@angular/core';
import { Artifact_Management } from './artifact_management';

@Injectable({
  providedIn: 'root'
})
export class ArtifactServiceService {
  message = 0
  constructor() { }

  setMessage(data:number){
    this.message = data
  }

  getMessage(){
    return this.message
  }
}
