import { Component, OnInit } from '@angular/core';
import { User } from '../user';
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {

  user: User = new User(1, 
                        "j.doe", 
                        "j.doe@student.tue.nl", 
                        "John Doe is a student assistant labelling for the department of Mathematics and Computer Sciences");
 
  edit: boolean = false;
}
