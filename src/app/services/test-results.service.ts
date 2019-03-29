import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TestResults } from '../models/userTestResults';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class TestResultsService {

  constructor(private http: HttpClient) { }

  testsResultsUrl = 'http://localhost:50672/api/results/';

  getUserTestResult(userId: string): Observable<TestResults[]> {
   return this.http.get<TestResults[]>(this.testsResultsUrl + {userId});
  }

}
