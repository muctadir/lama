import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'app/classes/user';

@Component({
  selector: 'app-account-information',
  templateUrl: './account-information.component.html',
  styleUrls: ['./account-information.component.scss']
})
export class AccountInformationComponent {
  @Input() userAccount!: User;
  @Output() modeChangeEvent = new EventEmitter<number>();

}
