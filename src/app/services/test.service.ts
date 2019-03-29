import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Test } from '../models/test';
import { Results } from '../models/result';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class TestService {

  constructor(private http: HttpClient ) {
    console.log('Data service connected...');
  }

  testsUrl = 'http://localhost:50672/api/tests';
  testsResultsUrl = 'http://localhost:50672/api/results/';

getTests(): Observable<Test[]> {
 return this.http.get<Test[]>(this.testsUrl);
}

getUserTestResults(userId: string): Observable<Results[]> {
 return this.http.get<Results[]>(this.testsResultsUrl + userId);
}

}
