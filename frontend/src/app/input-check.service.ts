import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InputCheckService {

  constructor() { }

  /* Method responsible for checking whether the input is non-empty in */
  checkFilled(input: string) {
    // if input == empty -> return false
    if(!input){
      return false;
    // input == empty -> return true
    } else {
      return true;
    } 
  }

  /* Method responsible for checking whether an email address is valid */
  checkEmail(email: string) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
      return true;
    } else{
      return false;
    }
  }
}
