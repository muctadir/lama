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
  projectMembers: User[] = [];
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

  test(): void{
    
  }
}
