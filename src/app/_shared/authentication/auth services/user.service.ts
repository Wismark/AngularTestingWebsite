import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../auth models/user.model';


@Injectable({
  providedIn: 'root'
})

export class UserService {
  readonly rootUrl = 'http://localhost:50672';
  constructor(private http: HttpClient) { }

  registerUser(user: User) {
    const body: User = {
      Login: user.Login,
      Password: user.Password,
      Email: user.Email,
      FirstName: user.FirstName,
      LastName: user.LastName,
      MiddleName: user.MiddleName,
      DateOfBirth: user.DateOfBirth
    };
    var reqHeader = new HttpHeaders({'No-Auth': 'True'});
    return this.http.post(this.rootUrl + '/api/User/Register', body, {headers: reqHeader});
  }

  userAuthentication(userName, password) {
    let data = 'username=' + userName + '&password=' + password + '&grant_type=password';
    let reqHeader = new HttpHeaders({'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True'});
    return this.http.post(this.rootUrl + '/token', data, {headers: reqHeader} );
  }
}
