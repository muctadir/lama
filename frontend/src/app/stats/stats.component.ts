import { Component } from '@angular/core';

type user = {
  username: string,
  nr_labelled: number,
  time: number,
  nr_themes: number,
  nr_conflicts: number
}

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent {

  //Pagination Settings
  page = 1;
  pageSize = 10;

  // Dummy data
  user_contribution: Array<user> = [
    {
      username: "Harry",
      nr_labelled: 5,
      time: 20,
      nr_themes: 4,
      nr_conflicts: 2
    },
    {
      username: "Barry",
      nr_labelled: 1,
      time: 42,
      nr_themes: 2,
      nr_conflicts: 1
    },
    {
      username: "Warry",
      nr_labelled: 2,
      time: 21,
      nr_themes: 1,
      nr_conflicts: 2
    },
    {
      username: "Sarry",
      nr_labelled: 0,
      time: 0,
      nr_themes: 0,
      nr_conflicts: 0
    },
    
  ]



}
