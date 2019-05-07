import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QuestionInfo } from '../models/QuestionInfo';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  APIurl = 'http://localhost:50672/api/';
  constructor(private http: HttpClient) { }

  getCurrentQuestionID(index, testId) {
    return this.http.get(`${this.APIurl}test-process/${index}/${testId}`);
}

getTestQuestionsById(testId: number): Observable<QuestionInfo[]> {
    return this.http.get<QuestionInfo[]>(`${this.APIurl}tests/questions/` + testId);
}

addNewTestQuestion(info: QuestionInfo) {
    const body = { Text: info.Text, QuestionType: info.QuestionType, TestId: info.TestId, AreaId: info.AreaId };

    return this.http.post(`${this.APIurl}tests/new-questions/`, body);
}

getQuestionInfoById(questionId: number): Observable<QuestionInfo> {
    return this.http.get<QuestionInfo>(`${this.APIurl}question/` + questionId);
}

updateTestQuestion(info: QuestionInfo) {
    const body = { Text: info.Text, QuestionType: info.QuestionType, TestId: info.TestId, AreaId: info.AreaId, QuestionId: info.QuestionId };

    return this.http.put(`${this.APIurl}tests/update-questions/`, body);
}

updateQuestions(testId: number, questions: QuestionInfo[]) {
    const body = { testId, questions };

    return this.http.post(`${this.APIurl}test/update-question/`, body);
}
}
