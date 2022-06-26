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
  /* Emits an event indicating a different page should be displayed */
  @Output() modeChangeEvent = new EventEmitter<number>();
}