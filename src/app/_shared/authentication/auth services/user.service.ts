import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../auth models/user.model';


@Injectable({
  providedIn: 'root'
})

export class UserService {
  readonly rootUrl = 'http://localhost:50672';
  constructor(private http: HttpClient) { }
 
  registerUser(user : User){
    const body: User = {
      Login: user.Login,
      Password: user.Password,
      Email: user.Email,
      FirstName: user.FirstName,
      LastName: user.LastName,
      MiddleName: user.MiddleName,
      DateOfBirth: user.DateOfBirth
    }
    return this.http.post(this.rootUrl + '/api/User/Register', body);
  }
}