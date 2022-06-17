import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Changelog } from 'app/classes/changelog';
import { HistoryDataService } from 'app/services/history-data.service';

@Component({
  selector: 'app-theme-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent {
  /* Gets the type of history that should be gathered */
  @Input() history_type!: string;

  /* Array with all the changelogs */
  changelog: Changelog[] = [];

  constructor(public activeModal: NgbActiveModal, private historyService: HistoryDataService) { }

  ngOnInit() {
    this.getHistoryData();
  }

  async getHistoryData() {
    this.changelog = await this.historyService.getHistory(this.history_type);
  }

}
