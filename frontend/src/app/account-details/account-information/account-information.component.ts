//@Author Jarl Jansen

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'app/classes/user';

@Component({
  selector: 'app-account-information',
  templateUrl: './account-information.component.html',
  styleUrls: ['./account-information.component.scss']
})
export class AccountInformationComponent {
  /* Holds account information of the user */
  @Input() userAccount!: User;
  /* Holds an error message if data retrieval from the backend went wrong */
  @Input() errorM!: string;
  /* Emits an event indicating a different page should be displayed */
  @Output() modeChangeEvent = new EventEmitter<number>();
}
