import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { StringArtifact } from './stringartifact';
import { LabelType } from './label-type';
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
}