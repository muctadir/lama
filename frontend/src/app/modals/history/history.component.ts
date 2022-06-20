// Author: Jarl Jansen
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Changelog } from 'app/classes/changelog';
import { HistoryDataService } from 'app/services/history-data.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent {
  /* Gets the type of history that should be gathered */
  @Input() history_type!: string;

  /* Array with all the changelogs */
  changelog: Changelog[] = [];

  /**
   * Initializes the NgbActiveModal and the HistoryDataService
   * 
   * @param activeModal instance of the NgbActiveModal
   * @param historyService instance of the HistoryDataService
   */
  constructor(public activeModal: NgbActiveModal, private historyService: HistoryDataService) { }

  /**
   * Calls the getHistoryData function, which will get the changelogs of the item currently getting viewed
   * Items can be themes, labels, artifacts
   * 
   * @trigger on component creation
   * @modifies changelog
   */
  ngOnInit() {
    this.getHistoryData();
  }

  /**
   * Will get the changelogs of the item currently getting viewed
   * Items can be themes, labels, artifacts
   * 
   * @modifies @changelog
   */
  async getHistoryData() {
    this.changelog = await this.historyService.getHistory(this.history_type);
  }
}
