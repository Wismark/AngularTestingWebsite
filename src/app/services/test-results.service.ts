import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TestResults } from '../models/userTestResults';
import { Observable } from 'rxjs';
import { Results } from '../models/result';
import { UserAnswer } from '../models/userAnswer';
import {formatDate } from '@angular/common';
import { Area } from '../models/area';
import { AreaDeleteInfo } from '../models/areaDeleteInfo';
import { ResultByArea } from '../models/resultByArea';

@Injectable({
  providedIn: 'root'
})

export class TestResultsService {

  constructor(private http: HttpClient) { }

  APIurl = 'http://localhost:50672/api/';

  getUserTestResult(userId: string): Observable<TestResults[]> {
   return this.http.get<TestResults[]>(this.APIurl + {userId});
  }

  getTestResultsByUserId(userId: string): Observable<Results[]> {
    return this.http.get<Results[]>(`${this.APIurl}results/` + userId);
}

checkUsersTestResult(time:number, answers: UserAnswer[], userId:any, testid:number) {
    let date = formatDate(new Date(), 'yyyy/MM/dd hh:mm:ss', 'en');
    const body = { Answers: answers, UserId:userId, TestId:testid, FinishDate:date, UserTime:time};
    return this.http.post<UserAnswer[]>(`${this.APIurl}test/check-result/`, body);
}

getTestResult(resultId) {
    return this.http.get<Results>(`${this.APIurl}test/result/`+ resultId);
}

updateAreas(areas: Area[], testId: number) {
    const body = { Areas: areas, TestID: testId };

    return this.http.post(`${this.APIurl}test/update-areas/`, body);
}

checkAreasOnDelete(areas: Area[], testId: number): Observable<AreaDeleteInfo[]> {
    const body = { Areas: areas, TestID: testId };
    return this.http.post<AreaDeleteInfo[]>(`${this.APIurl}test/check-areas/`, body);
}

getResultsInArea(resultId:number) {
    return this.http.get<ResultByArea[]>(`${this.APIurl}area-results/${resultId}`);
}
}
