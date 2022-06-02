// Veerle Furst

import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import axios from 'axios';

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

  ngOnInit(){
    console.log("hello")
    let userInformation = this.getInformation()

  }

  getInformation(){
    // Post to backend
    const response = axios.get("http://127.0.0.1:5000/account/information")
    .then(response =>{
      // TODO
    })
    .catch(error =>{
      // TODO
    })
  }

  changeInformation(){

  }
}