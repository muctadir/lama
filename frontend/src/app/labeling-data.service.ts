import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { StringArtifact } from 'app/classes/stringartifact';
import { LabelType } from 'app/classes/label-type';
import { artifact, labels } from './static-test-info';

@Injectable({
  providedIn: 'root'
})
export class LabelingDataService {

  getArtifact(): Observable<StringArtifact> { 
    return of(artifact);
  }

  getLabels(): Observable<Array<LabelType>> {
    return of(labels);
  }

  pushLabels(newLabels: Array<LabelType>): void{
    console.log("Pushing to backend...")
    console.log(newLabels)
    throw new Error("Not implemented");
  }
}