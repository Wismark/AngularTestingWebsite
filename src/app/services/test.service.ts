import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Test } from '../models/test';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class TestService {

  constructor(private http: HttpClient ) {
    console.log('Data service connected...');
  }

  testsUrl = 'http://localhost:50672/api/tests';

getTests(): Observable<Test[]> {
 return this.http.get<Test[]>(this.testsUrl);
}

/*
return [
      {TestId: 1, Name: 'Math', NumOfQuestions: 30, Active: true, TimeLimitation: 20 },
      {TestId: 2, Name: 'Music', NumOfQuestions: 20, Active: true, TimeLimitation: 20  },
      {TestId: 3, Name: 'Geometry', NumOfQuestions: 35, Active: true, TimeLimitation: 20 }
  ];
*/
}
