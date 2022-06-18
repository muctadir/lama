import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InputCheckService {

  /**
   * Checks whether the string input is non-empty
   * 
   * @param input the input to be checked
   * @returns false if the input is empty, true if the input is non-empty
   */
  checkFilled(input: string) : boolean{
    // if input is empty returns false
    if(!input){
      return false;
    // if input is empty returns true
    } else {
      return true;
    } 
  }

  /**
   * Checks whether the string input is a valid email
   * Top level domain of the email address must be 2 or 3 characters
   * 
   * @param email the input to be checked
   * @returns true if the input is a valid email, false otherwise
   */
  checkEmail(email: string) : boolean {
    // if email is correct returns true
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
      return true;
    // if email is incorrect returns false
    } else{
      return false;
    }
  }
}
