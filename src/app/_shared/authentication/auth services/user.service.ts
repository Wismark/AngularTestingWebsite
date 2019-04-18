import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
        const reqHeader = new HttpHeaders({ 'No-Auth': 'True' });
        return this.http.post(this.rootUrl + 'User/Register', body, { headers: reqHeader });
    }

    userAuthentication(userName, password) {
        const data = 'username=' + userName + '&password=' + password + '&grant_type=password';
        const reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True' });
        return this.http.post(this.rootUrl + '/token', data, { headers: reqHeader });
    }

    roleMatch(allowedRoles: string[]): boolean {
        let isMatch = false;
        const userRole: string = JSON.parse(localStorage.getItem('userRole'));
        allowedRoles.forEach((element: string) => {
            if (userRole === element) {
                isMatch = true;
                return false;
            }
        });
        return isMatch;
    }

    setAdminRole(userId: string) {
        return this.http.put(this.rootUrl + '/api/give-admin/?userId=' + userId, null);
    }

    setUserRole(userId: string) {
        return this.http.put(this.rootUrl + '/api/give-user/?userId=' + userId, null);
    }

}
