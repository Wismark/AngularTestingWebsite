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

  APIurl = 'http://localhost:50672';

getTests(): Observable<Test[]> {
 return this.http.get<Test[]>(this.APIurl + '/api/tests');
}

getUserTestResults(userId: string): Observable<Results[]> {
 return this.http.get<Results[]>(this.APIurl + '/api/results/' + userId);
}

}
