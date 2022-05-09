import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss']
})
export class TestingComponent implements OnInit {
  text = "";

  constructor() { }

  ngOnInit(): void { }

  postrequest() {
    const post_list = document.querySelector('#post_output');
    if (post_list != null) {
      const article = { title: 'Axios POST Request Example' };
      const response = axios.post('http://127.0.0.1:5000/user', {}, {params: {username: "Lannes", password: "VivLF"}})
        .then(response => post_list.innerHTML = response.data)
        .catch(error => {
          this.text = "There was an error";
          console.log(error);
        });
    }
  }

  getrequest() {
    const get_list = document.querySelector('#get_output');
    if (get_list != null) {
      // Tries the get request and outputs the response to the webpage
      const response = axios.get('http://127.0.0.1:5000/users')
        .then(response => get_list.innerHTML = JSON.stringify(response.data))
        .catch(error => {
          this.text = "There was an error";
          console.log(error);
        });
    }
  }

}
