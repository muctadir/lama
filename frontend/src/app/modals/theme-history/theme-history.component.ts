import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HistoryDataService } from 'app/services/history-data.service';

@Component({
  selector: 'app-theme-history',
  templateUrl: './theme-history.component.html',
  styleUrls: ['./theme-history.component.scss']
})
export class ThemeHistoryComponent {
  /* Array with all the changelogs */
  // changelog: any[] = [];

  constructor(public activeModal: NgbActiveModal, private historyService: HistoryDataService) { }

  ngOnInit() {
    this.getHistoryData();
  }

  getHistoryData() {
    this.historyService.getThemeHistory();
  }

}
