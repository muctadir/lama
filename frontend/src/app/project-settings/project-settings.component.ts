import { Component, OnInit } from '@angular/core';
import { User } from 'app/user';

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.scss']
})
export class ProjectSettingsComponent implements OnInit {

  projectName: string = "project name";
  projectDesc: string = "project description";
  projectMembers: string[] = ["Linh","Jarl","Thea", "Vic"];
  labelCount: string = "2";
  labelTypes: string[] = [];
  edit: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  clickEdit(): void {
    this.edit = true;
  }

  unclickEdit(): void {
    this.edit = false;
  }

  addMembers(username: string): void {
    //this.projectMembers.push(username);
  }

  addLabelTypes(labelType: string): void {
    this.labelTypes.push(labelType);
  }

  saveEdit(): void {
    this.projectName = (<HTMLInputElement>document.getElementById("projectName")).value;
    this.projectDesc = (<HTMLInputElement>document.getElementById("projectDescriptionForm")).value;
    this.labelCount = (<HTMLInputElement>document.getElementById("numberOfLabellers")).value;
    this.edit = false;
  }

  addLabelType(){
    this.labelTypes.push("");
  }

  test(): void{ 
  }
}
