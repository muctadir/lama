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

  register() {
    const post_form: HTMLFormElement = (document.querySelector("#registrationForm")! as HTMLFormElement);
    const p_response: HTMLElement = document.querySelector("#registrationResponse")!;
    if (post_form != null && post_form.checkValidity()) {
      const article = { title: 'Registration POST Request' };
      let params: Record<string, string> = {};
      for (let i = 0; i < post_form.length; i++) { // No forEach for HTMLCollection
        let param = post_form[i] as HTMLInputElement;
        params[param.name] = param.value;
      }

      const response = axios.post('http://127.0.0.1:5000/auth/register', {}, {params: params})
       .then(response => p_response.innerHTML = JSON.stringify([response.data, response.status]))
       .catch(error => {
         p_response.innerHTML = JSON.stringify([error.response.data, error.response.status])
       });
    

    } else {
      alert("Bad formatting");
    }
  }

  getrequest() {
    const get_list = document.querySelector('#get_output');
    if (get_list != null) {
      // Tries the get request and outputs the response to the webpage
      const response = axios.get('http://127.0.0.1:5000/auth/pending')
        .then(response => get_list.innerHTML = JSON.stringify(response.data))
        .catch(error => {
          this.text = "There was an error";
          console.log(error);
        });
    }
  }

}
