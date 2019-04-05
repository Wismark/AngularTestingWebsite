import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Test } from '../models/test';
import { Results } from '../models/result';
import { Observable } from 'rxjs';
import { User } from '../_shared/authentication/auth models/user.model';
import { UserModel } from '../models/userModel';
import { Area } from '../models/area';
import { QuestionInfo } from '../models/QuestionInfo';

@Injectable({
  providedIn: 'root'
})


export class TestService {
  constructor(private http: HttpClient) {
    console.log('Data service connected...');
  }

  APIurl = 'http://localhost:50672';

  getTests(): Observable<Test[]> {
    return this.http.get<Test[]>(this.APIurl + '/api/tests');
  }

  getTestResultsByUserId(userId: string): Observable<Results[]> {
    return this.http.get<Results[]>(this.APIurl + '/api/results/' + userId);
  }

  getUsersWithResults(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(this.APIurl + '/api/users/result');
  }

  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(this.APIurl + '/api/users');
  }

  getTestInfoById(testId: number): Observable<Test> {
    return this.http.get<Test>(this.APIurl + '/api/test-info/' + testId );
  }

  getTestAreaById(testId: number): Observable<Area[]> {
    return this.http.get<Area[]>(this.APIurl + '/api/tests/areas/' + testId );
  }

  getTestQuestionsById(testId: number): Observable<QuestionInfo[]> {
    return this.http.get<QuestionInfo[]>(this.APIurl + '/api/tests/questions/' + testId );
  }
}
