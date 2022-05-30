// Veerle Furst

import { Component, OnInit } from '@angular/core';

// Artifact object 
interface Artifact {
  artifactName: string,
  artifactDescription: string;
}

// Functions for adding values
function addValues(name:string, descr:string):Artifact {
  var artifactName = name;
  var artifactDescription = descr;
  // Return the given values
  return {artifactName, artifactDescription};
} 

// Labelled object 
interface Labeller {
  labellerName: string,
  labellerRemark: string,
  current: boolean;
}

// Functions for adding values
function addValuesLabeller(labeller:string, remark:string, cur:boolean):Labeller {
  var labellerName = labeller;
  var labellerRemark = remark;
  var current = cur;
  // Return the given values
  return {labellerName, labellerRemark, current};
} 

@Component({
  selector: 'app-conflict-resolution',
  templateUrl: './conflict-resolution.component.html',
  styleUrls: ['./conflict-resolution.component.scss']
})
export class ConflictResolutionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  // Hardcoding an artifact
  conflict1 = addValues("Artifact 1", `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu venenatis nunc. 
  Nam porttitor, tortor id blandit facilisis, tellus ex interdum nisl, nec molestie quam erat vitae lacus. 
  Phasellus pulvinar risus a tortor congue fringilla. Aliquam malesuada nec velit vel sollicitudin. Nunc dictum ipsum nibh, ut convallis ipsum faucibus a. 
  Aliquam auctor dictum mi, eget venenatis libero commodo quis. Etiam a molestie tortor.
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus tincidunt est in ultricies laoreet. Aenean dignissim tincidunt eros ac consequat. 
  Fusce turpis ligula, viverra non felis ut, accumsan vulputate sem. 
  Vestibulum sollicitudin lacus eu massa sagittis, luctus luctus mi sollicitudin. Mauris mi nisi, viverra eu massa ut, interdum pretium diam. 
  Donec dignissim id libero quis scelerisque. Vestibulum quis venenatis enim. Ut non lectus quis odio feugiat commodo eu quis libero. 
  Suspendisse at urna risus. Ut tincidunt ipsum ut enim rhoncus viverra. Vestibulum in posuere elit. Phasellus at risus mauris.`);
  

  // Hardcoding some labellers
  labeller1 = addValuesLabeller("Veerle", "I think this artifact is unreadable", true);
  labeller2 = addValuesLabeller("Chinno", "What is this artifact?", false);
  labeller3 = addValuesLabeller("Jarl", "Yeah no this is a mistake", false);
  labeller4 = addValuesLabeller("Vic", "I will remove this artifact later", false);
  // List of labellers
  labellers: Labeller[] = [this.labeller1, this.labeller2, this.labeller3, this.labeller4]

}
