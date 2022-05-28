import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { StringArtifact } from './stringartifact';
import { LoremIpsum } from "lorem-ipsum";
import { LabelType } from './label-type';
import { Label } from './label';

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

@Injectable({
  providedIn: 'root'
})
export class LabelingDataService {

  getArtifact(): Observable<StringArtifact> {
    const artifact = new StringArtifact("1", lorem.generateParagraphs(5), false);
    return of(artifact);
  }

  getLabels(): Observable<Array<LabelType>> {
    var labelTypes: Array<LabelType> = Array<LabelType>(); 
    for (var i: number = 0; i <= Math.ceil(Math.random()*9); i++) {
      var labeltype: LabelType = new LabelType(lorem.generateWords(1), lorem.generateSentences(5), new Array<Label>());
      for (var j: number = 0; j <= Math.ceil(Math.random()*9); j++) {
        var label: Label = new Label(j.toString(), lorem.generateWords(1), lorem.generateParagraphs(1), Math.ceil(Math.random()*9), false);
        labeltype.addLabel(label);
      }
      labelTypes.push(labeltype);
    }
    return of(labelTypes);
  }
}